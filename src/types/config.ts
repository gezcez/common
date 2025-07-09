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
		portal: {
			"base.access": number
			"users.permissions.read": number
			"users.permissions.write": number
			"users.permissions.list": number
			"users.list": number
			"base.network_admin": number
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
