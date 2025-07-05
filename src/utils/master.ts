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

export function buildConfig<T extends IConfig>() {
	const config_path = process.env.CONFIG_PATH
	if (!config_path)
		throw Error("utils.master: process.env.config_path is undefined")
	return require(config_path) as T
}
