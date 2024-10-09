import { Module } from '@nestjs/common';

import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg'
import { TaskModule } from './task/task.module';

@Module({
	imports: [
		KyselyModule.forRoot({
			dialect: new PostgresDialect({
				pool: new Pool({
					host: 'localhost',
					port: 5432,
					user: 'postgres',
					password: 'your-super-secret-and-long-postgres-password',
					database: 'postgres',
				}),
			}),
		}),
		TaskModule,
	],
})
export class AppModule { }
