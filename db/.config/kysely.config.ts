import {
    PostgresDialect,
} from 'kysely'
import { Pool } from 'pg'
import { defineConfig } from 'kysely-ctl'

export default defineConfig({
    // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
    dialect: new PostgresDialect({
        pool: new Pool({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'your-super-secret-and-long-postgres-password',
            database: 'postgres',
        }),
    }),
    migrations: {
        allowJS: true,
        allowUnorderedMigrations: false,
    }
})
