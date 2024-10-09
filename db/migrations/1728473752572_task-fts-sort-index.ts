import { sql, type Kysely } from 'kysely'
import { Db } from '../src/lib/db';

export async function up(db: Kysely<Db>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
		.alterTable('task')
		.addColumn('task_fts_vector', sql`tsvector`, (col) => col.generatedAlwaysAs(sql`to_tsvector('english', name || description)`).stored())
		.execute()

	await db.schema
		.createIndex('task_created_at_sort_index')
		.on('task')
		.column('created_at desc')
		.execute()

	await db.schema
		.createIndex('task_updated_at_sort_index')
		.on('task')
		.column('created_at desc')
		.execute()

	await db.schema
		.createIndex('task_fts_gin_index')
		.on('task')
		.column('task_fts_vector')
		.using('gin')
		.execute()

	await db.executeQuery(sql`
			CREATE TRIGGER task_fts_trigger
			BEFORE INSERT OR UPDATE on task
			FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(task_fts_vector, 'pg_catalog.english', name, description)
		`.compile(db)
	)

}

export async function down(db: Kysely<Db>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations

	await db.schema
		.dropIndex('task_created_at_sort_index')
		.execute()

	await db.schema
		.dropIndex('task_updated_at_sort_index')
		.execute()

	await db.schema
		.dropIndex('task_fts_gin_index')
		.execute()

	await db.schema
		.alterTable('task')
		.dropColumn('task_fts_vector')
		.execute()

	await db.executeQuery(sql`
			DROP TRIGGER task_fts_trigger ON task
		`.compile(db)
	)
}
