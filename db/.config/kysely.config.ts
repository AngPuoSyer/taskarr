import {
	PostgresDialect,
} from 'kysely'
import { Pool } from 'pg'
import { defineConfig } from 'kysely-ctl'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	dialect: new PostgresDialect({
		pool: new Pool({
			host: 'localhost',
			port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
		}),
	}),
	migrations: {
		allowJS: true,
		allowUnorderedMigrations: false,
	}
})
