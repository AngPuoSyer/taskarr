import { Value } from "@sinclair/typebox/value"
import { TaskProps, TaskSchema, TaskSchemaStore } from "./types"
import { TaskFixture } from './task.fixture'

describe('TaskSchema', () => {
	describe('schema', () => {
		describe('id', () => {
			it('should validate if id is in the format of objectId', () => {
				const id = '1'.repeat(24)
				expect(Value.Check(TaskSchemaStore.id, id)).toEqual(true)
			})

			it('should invalidate if id is not in the format of objectId', () => {
				const id = 'x'.repeat(24)
				expect(Value.Check(TaskSchemaStore.id, id)).toEqual(false)
			})
		})

		describe('name', () => {
			it('should validate if name is in the type of string', () => {
				const name = 'name'
				expect(Value.Check(TaskSchemaStore.name, name)).toEqual(true)
			})

			it('should invalidate if name is not in the type of string', () => {
				const name = 1
				expect(Value.Check(TaskSchemaStore.name, name)).toEqual(false)
			})

			it('should invalidate if name is an empty string', () => {
				const name = ''
				expect(Value.Check(TaskSchemaStore.name, name)).toEqual(false)
			})

			it('should invalidate if name exceeds 100 characters', () => {
				const name = 'a'.repeat(101)
				expect(Value.Check(TaskSchemaStore.name, name)).toEqual(false)
			})
		})

		describe('description', () => {
			it('should validate if description is not in the type of string', () => {
				const description = 'description'
				expect(Value.Check(TaskSchemaStore.description, description)).toEqual(true)
			})

			it('should invalidate if description is not in the type of string', () => {
				const description = 1
				expect(Value.Check(TaskSchemaStore.description, description)).toEqual(false)
			})

			it('should invalidate if description exceeds 1000 characters', () => {
				const description = 'a'.repeat(1001)
				expect(Value.Check(TaskSchemaStore.description, description)).toEqual(false)
			})
		})

		describe('dueDate', () => {
			it('should validate if dueDate is in the type of date', () => {
				const dueDate = new Date()
				expect(Value.Check(TaskSchemaStore.dueDate, dueDate)).toEqual(true)
			})

			it('should invalidate if dueDate is not in the type of date', () => {
				const dueDate = 'date'
				expect(Value.Check(TaskSchemaStore.dueDate, dueDate)).toEqual(false)
			})
		})

		describe('createdAt', () => {
			it('should validate if createdAt is in the type of date', () => {
				const createdAt = new Date()
				expect(Value.Check(TaskSchemaStore.createdAt, createdAt)).toEqual(true)
			})

			it('should invalidate if createdAt is not in the type of date', () => {
				const createdAt = 'date'
				expect(Value.Check(TaskSchemaStore.createdAt, createdAt)).toEqual(false)
			})
		})

		describe('updatedAt', () => {
			it('should validate if updatedAt is in the type of date', () => {
				const updatedAt = new Date()
				expect(Value.Check(TaskSchemaStore.updatedAt, updatedAt)).toEqual(true)
			})

			it('should invalidate if updatedAt is not in the type of date', () => {
				const updatedAt = 'date'
				expect(Value.Check(TaskSchemaStore.updatedAt, updatedAt)).toEqual(false)
			})
		})
	})

	describe('Task', () => {
		let task: TaskProps
		beforeEach(() => {
			task = TaskFixture.generateTaskProps()
		})

		it('should validate if task is in the correct format', () => {
			expect(Value.Check(TaskSchema, task)).toEqual(true)
		})

		it('should invalidate if task is not an object', () => {
			expect(Value.Check(TaskSchema, 1)).toEqual(false)
		})

		describe('id', () => {
			it('should invalidate if id is undefined', () => {
				delete task.id
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should invalidate if id is not in the format of objectId', () => {
				task.id = 'x'.repeat(24)
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})
		})

		describe('name', () => {
			it('should invalidate if name is in the invalid format', () => {
				// @ts-expect-error test error case
				task.name = 1
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should invalidate if name is undefined', () => {
				delete task.name
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})
		})

		describe('description', () => {
			it('should invalidate if description is in the invalid format', () => {
				// @ts-expect-error test error case
				task.description = 1
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should invalidate if description is undefined', () => {
				delete task.description
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})
		})

		describe('dueDate', () => {
			it('should invalidate if dueDate is in the invalid format', () => {
				// @ts-expect-error test error case
				task.dueDate = 'date'
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should validate if dueDate is undefined', () => {
				delete task.dueDate
				expect(Value.Check(TaskSchema, task)).toEqual(true)
			})
		})

		describe('createdAt', () => {
			it('should invalidate if createdAt is in the invalid format', () => {
				// @ts-expect-error test error case
				task.createdAt = 'date'
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should invalidate if createdAt is undefined', () => {
				delete task.createdAt
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})
		})

		describe('updatedAt', () => {
			it('should invalidate if updatedAt is in the invalid format', () => {
				// @ts-expect-error test error case
				task.updatedAt = 'date'
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})

			it('should invalidate if updatedAt is undefined', () => {
				delete task.updatedAt
				expect(Value.Check(TaskSchema, task)).toEqual(false)
			})
		})
	})
})
