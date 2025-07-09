import { CanActivate, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import { GezcezError, GezcezValidationFailedError } from "../GezcezError"
import { GezcezJWTPayload } from "../types/gezcez"
import { isTokenInvalid, OAuthUtils } from "../utils/oauth"
export function AuthorizationGuard<T extends true,SCOPE extends "global" | "scoped">(config: {
	scope: SCOPE
	permission_id: number
	app_key: string
	sudo_mode?: T
	handleFetchFromDb?: T extends true ? (req:Request,scope_type:SCOPE,permission_id:number) => boolean : never
	handleInvalidation?: (
		payload: GezcezJWTPayload,
		context: ExecutionContext
	) => boolean
}) {
	return class Guard implements CanActivate {
		async canActivate(context: ExecutionContext) {
			const req = context.switchToHttp().getRequest()
			const sudo_key = req.headers["sudo-key"]
			const token = req.headers.authorization?.split(" ")[1]
			if (!token) {
				throw GezcezError("UNAUTHORIZED", {
					__message:
						"Bu işlemi gerçekleştirmek için giriş yapmış olmanız lazım. (token undefined)",
				})
			}
			const payload = await OAuthUtils.verifyJWT(token, config.app_key)
			if (!payload) {
				throw GezcezError("UNAUTHORIZED", {
					__message: "Bu işlemi gerçekleştirmek için giriş yapmış olmanız lazım.",
				})
			}
			if (payload.type !== "access") throw GezcezError("BAD_REQUEST",{
				__message:`token.type geçersiz ('access' beklenirken '${payload.type} bulundu')`
			})
			const network_id = req["network_id"]
			let can_activate = false
			if (config.scope === "scoped") {
				if (!network_id)
					throw GezcezValidationFailedError(
						"params:network_id",
						"network_id is undefined"
					)
				can_activate = await OAuthUtils.doesPermissionsMatch(
					payload,
					network_id,
					config.permission_id
				)
			} else {
				can_activate = await OAuthUtils.doesPermissionsMatch(
					payload,
					"global",
					config.permission_id
				)
			}
			if (!can_activate) {
				throw GezcezError("FORBIDDEN", {
					__message: "Bu işlemi gerçekleştirmek için yetkiniz yok.",
				})
			}
			if (config.sudo_mode) {
				await config.handleFetchFromDb!(
					req,
					config.scope === "scoped" ? network_id! : "global",
					config.permission_id
				)
			} else if (config.handleFetchFromDb) {
				await config.handleFetchFromDb!(
					req,
					config.scope === "scoped" ? network_id! : "global",
					config.permission_id
				)
			}
			if (config.handleInvalidation) {
				await config.handleInvalidation(payload, context)
			} else {
				const is_invalid = await isTokenInvalid(payload)
				if (is_invalid) {
					throw GezcezError("UNAUTHORIZED",{__message:"Oturumun süresi dolmuş veya çıkış yapılmış."})
				}
			}
			req["payload"] = payload
			return true
		}
	}
}
