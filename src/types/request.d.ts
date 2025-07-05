import { GezcezJWTPayload } from "./gezcez"

declare global {
	namespace Express {
		interface Request {
			payload: GezcezJWTPayload
			network_id: number
		}
	}
}
export {}
