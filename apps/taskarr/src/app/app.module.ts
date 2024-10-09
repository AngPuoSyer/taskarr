import { Module } from '@nestjs/common';

import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg'
import { TaskModule } from './task/task.module';
import * as config from '../config';

@Module({
	imports: [
		KyselyModule.forRoot({
			dialect: new PostgresDialect({
				pool: new Pool({
					host: config.postgres.host,
					port: config.postgres.port,
					user: config.postgres.user,
					password: config.postgres.password,
					database: config.postgres.database,
				}),
			}),
		}),
		TaskModule,
	],
})
export class AppModule { }
