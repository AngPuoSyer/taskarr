import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KyselyModule } from 'nestjs-kysely'
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg'

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
        })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
