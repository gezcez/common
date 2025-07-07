import { IConfig } from "../types/config"

type logType = (string | number)[]
export abstract class logger {
	static success(...strings: logType) {
		console.log(`[${new Date().toISOString()}] ${process.env.instance_type}@gezcez.com: 🟢`, ...strings)
	}
	static warning(...strings: logType) {
		console.log(`[${new Date().toISOString()}] ${process.env.instance_type}@gezcez.com: 🟡`, ...strings)
	}
	static error(...strings: logType) {
		console.log(`[${new Date().toISOString()}] ${process.env.instance_type}@gezcez.com: 🔴`, ...strings)
	}
	static log(...strings: logType) {
		console.log(`[${new Date().toISOString()}] ${process.env.instance_type}@gezcez.com:`, ...strings)
	}
}

export type TJoinStrings<A extends string, B extends string> = `${A}${B}`
let imported_util : IConfig
export function buildConfig<T extends IConfig>() {
	if (imported_util) return imported_util
	const config_path = process.env.CONFIG_PATH
	if (!config_path)
		logger.warning("utils.master: process.env.config_path is undefined, using the defaults")
	imported_util = require(config_path || "../service.config.json") as T
	return imported_util
}
