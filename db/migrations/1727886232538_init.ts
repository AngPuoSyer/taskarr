import { sql, type Kysely } from 'kysely'
import type { Db } from '../src/lib/db'

export async function up(db: Kysely<Db>): Promise<void> {
    // up migration code goes here...
    // note: up migrations are mandatory. you must implement this function.
    // For more info, see: https://kysely.dev/docs/migrations
    await db.schema.createTable('task')
        .addColumn('id', 'bytea', (col) => col.primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('description', 'text')
        .addColumn('due_date', 'timestamptz')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute()

    // TODO: create indexes in the next migration
}

export async function down(db: Kysely<Db>): Promise<void> {
    // down migration code goes here...
    // note: down migrations are optional. you can safely delete this function.
    // For more info, see: https://kysely.dev/docs/migrations
    await db.schema.dropTable('task').execute()
}
