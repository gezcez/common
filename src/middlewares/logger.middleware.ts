import type { Response, Request, NextFunction } from "express"
import { logger } from "../utils"

export function LoggerMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const is_prod = process.env.NODE_ENV !== "dev"
	logger.log(`[${req.method}] [${is_prod ? req.headers["CF-Connecting-IP"]: req.ip}] ${req.url}`)
	next()
}
