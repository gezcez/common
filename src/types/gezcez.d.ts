
export type GezcezJWTPayload = {
	jti: string
	sub: number
	scopes: { [key: string]: number }
	is_activated: boolean
} & Omit<JWTPayload, "sub">