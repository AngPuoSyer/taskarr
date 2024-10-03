import type { Insertable, Updateable, Selectable } from "kysely"

export interface BaseSchema {
    created_at: Date,
    updated_at: Date,
}

export interface TaskTable extends BaseSchema {
    id: Buffer,
    name: string,
    description?: string,
    due_date?: Date,

}

export interface Db {
    task: TaskTable
}

export type Task = Selectable<TaskTable>
export type NewTask = Insertable<TaskTable>
export type TaskUpdate = Updateable<TaskTable>
