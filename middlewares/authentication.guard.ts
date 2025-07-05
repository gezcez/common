import { CanActivate, ExecutionContext } from "@nestjs/common"
import { JWK, jwtVerify, JWTVerifyOptions, KeyObject } from "jose"
import { GezcezError } from "../src/GezcezError"
import { GezcezJWTPayload } from "../src/types/gezcezzcez"
import { OAuthUtils } from "../src/utils/oauthauth"

export function AuthenticationGuard(config: {
	app_key: string
	override_jwt_config: {
		secret: CryptoKey | KeyObject | JWK | Uint8Array
		payload: JWTVerifyOptions
	}
	handleInvalidation?: (
		payload: GezcezJWTPayload,
		context: ExecutionContext
	) => boolean
}) {
	class Guard implements CanActivate {
		async canActivate(context: ExecutionContext) {
			const req = context.switchToHttp().getRequest()
			const token = req.headers.authorization?.split(" ")[1]

			if (!token) {
				throw GezcezError("UNAUTHORIZED", {
					__message:
						"Bu işlemi gerçekleştirmek için giriş yapmış olmanız lazım. (token undefined)",
				})
			}
			let payload 
			if (config.override_jwt_config) {
				const {payload:payload_i} = await jwtVerify(token, config.override_jwt_config.secret, config.override_jwt_config.payload)
				payload=payload_i as any as GezcezJWTPayload
			} else {
				payload = await OAuthUtils.verifyJWT(token, config.app_key)
			}
			if (!payload) {
				throw GezcezError("UNAUTHORIZED", {
					__message:
						"Bu işlemi gerçekleştirmek için giriş yapmış olmanız lazım. (unverified payload)",
				})
			}
			if (config.handleInvalidation) {
				await config.handleInvalidation(payload, context)
			}
			req["payload"] = payload
			return true
		}
	}
	return Guard
}
