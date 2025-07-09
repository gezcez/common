export interface IConfig {
	[key: string]: any
	sudo_mode_ttl: number
	third_party_urls: {
		email_service: string
	}
	permissions: {
		oauth: {}
		system: {
			"networks.read": number
			"networks.write": number
			root: number
			"permissions.read": number
			"permissions.write": number
			"apps.read": number
			"apps.write": number
		}
		dashboard: {
			
			"base.access":number,
			"users.permissions.read":number,
			"users.permissions.write":number,
			"users.permissions.list":number,
			"users.list":number,
			"base.roles.list-permissions":number,
			"users.roles.read":number,
			"users.roles.write":number,
			"base.roles.list":number,
			"base.roles.list-users":number,
		}
	}
	validation: {
		password: {
			min_length: number
			max_length: number
		}
		username: {
			min_length: number
			max_length: number
		}
		email: {
			min_length: number
			max_length: number
		}
	}
}
