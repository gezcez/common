import { IConfig } from "../types/config"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { and, eq, gte } from "drizzle-orm"

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

export async function fetchJSON(input: string | URL | globalThis.Request, init?: RequestInit) {
	const request = await fetch(input, init)
	const json = await request.json()
	return json
}
import { LibSQLDatabase } from "drizzle-orm/libsql"
import {
	networksTable,
	permissionPathMatrix,
	permissionsTable,
	refreshTokensTable,
	rolePermissionsTable,
	rolesTable,
} from "../schemas/backend"

export let SYNCED_CONFIG: {
	roles: (typeof rolesTable.$inferSelect)[]
	role_permissions: (typeof rolePermissionsTable.$inferSelect)[]
	permissions: (typeof permissionsTable.$inferSelect)[]
	networks: (typeof networksTable.$inferSelect)[]
	invalid_tokens: string[]
	path_registries: (typeof permissionPathMatrix.$inferSelect)[]
	__DANGEROURS_ACCESS_DB: LibSQLDatabase | undefined
} = {
	roles: [],
	role_permissions: [],
	permissions: [],
	networks: [],
	path_registries:[],
	__DANGEROURS_ACCESS_DB: undefined,
	invalid_tokens: [],
}

export async function RELOAD_SYNCED_CONFIG(args: { db: LibSQLDatabase }) {
	logger.log("refreshing sync config!")
	let { db } = args
	const networks_promise = db.select().from(networksTable)
	const permissions_promise = db.select().from(permissionsTable)
	const roles_promise = db.select().from(rolesTable)
	const invalid_tokens_promise = db
		.select()
		.from(refreshTokensTable)
		.where(
			and(
				eq(refreshTokensTable.is_invalid, true),
				gte(refreshTokensTable.updated_at, new Date(Date.now() - ONE_DAY))
			)
		)
	const role_permissions_promise = db.select().from(rolePermissionsTable)
	const [networks, permissions, roles, invalid_tokens, role_permissions] = await Promise.all([
		networks_promise.all(),
		permissions_promise.all(),
		roles_promise.all(),
		invalid_tokens_promise.all(),
		role_permissions_promise.all(),
	])
	SYNCED_CONFIG.__DANGEROURS_ACCESS_DB = db
	SYNCED_CONFIG.networks = networks
	SYNCED_CONFIG.permissions = permissions
	SYNCED_CONFIG.roles = roles
	SYNCED_CONFIG.role_permissions = role_permissions
	SYNCED_CONFIG.invalid_tokens = invalid_tokens.map((e) => "invalid")
	logger.log(
		"sync successfull",
		`networks:${networks.length}`,
		`permissions:${permissions.length}`,
		`roles:${roles.length}`,
		`invalid_tokens:${invalid_tokens.length}`,
		`role_permissions:${role_permissions.length}`
	)
	return SYNCED_CONFIG
}
export const ONE_HOUR = 1 * 60 * 60 * 1000
export const ONE_DAY = 24 * ONE_HOUR
