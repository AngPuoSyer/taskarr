import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely } from 'kysely';
import { Db } from '@taskarr/db'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, @InjectKysely() private readonly db: Kysely<Db>) { }

    @Get()
    getData() {
        return this.appService.getData();
    }

    @Get('/tasks')
    async getTasks() {
        return this.db.selectFrom('task').selectAll().execute()
    }
}
