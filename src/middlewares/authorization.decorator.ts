import { applyDecorators, ExecutionContext, UseGuards } from "@nestjs/common"
import { ApiHeader, ApiParam } from "@nestjs/swagger"
import { NetworkGuard } from "./network.guard"
import { GezcezJWTPayload } from "../types"
import { AuthorizationGuard, IAuthorizationConfig } from "./authorization.guard"

export function UseAuthorization<T extends boolean, SCOPE extends "global" | "scoped">(
	config: IAuthorizationConfig<T, SCOPE>
) {
	return applyDecorators(
		UseGuards(NetworkGuard, AuthorizationGuard(config as any)),
		ApiParam({ name: "network_id", required: true, type: String,example:1 }),
		ApiHeader({ name: "Authorization", required: true, example:"Bearer ey..." })
	)
}
