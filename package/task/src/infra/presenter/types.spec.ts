import { Value } from "@sinclair/typebox/value"
import { TaskPresenter, TaskPresenterSchema } from './types'
import { TaskPresenterFixture } from './task.presenter.fixture'

describe('TaskPresenterSchema', () => {
	describe('TaskPresenter', () => {
		let task: TaskPresenter
		beforeEach(() => {
			task = TaskPresenterFixture.generateTaskPresenter()
		})

		it('should validate if task is in the correct format', () => {
			expect(Value.Check(TaskPresenterSchema, task)).toEqual(true)
		})

		it('should invalidate if task is not an object', () => {
			expect(Value.Check(TaskPresenterSchema, 1)).toEqual(false)
		})

		describe('id', () => {
			it('should invalidate if id is undefined', () => {
				delete task.id
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})

			it('should invalidate if id is not in the format of objectId', () => {
				task.id = 'x'.repeat(24)
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})
		})

		describe('name', () => {
			it('should invalidate if name is in the invalid format', () => {
				// @ts-expect-error test error case
				task.name = 1
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})

			it('should invalidate if name is undefined', () => {
				delete task.name
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})
		})

		describe('description', () => {
			it('should invalidate if description is in the invalid format', () => {
				// @ts-expect-error test error case
				task.description = 1
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})

			it('should validate if description is undefined', () => {
				delete task.description
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(true)
			})
		})

		describe('dueDate', () => {
			it('should invalidate if dueDate is not date', () => {
				// @ts-expect-error test error case
				task.dueDate = 'date'
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})

			it('should validate if dueDate is undefined', () => {
				delete task.dueDate
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(true)
			})
		})

		describe('createdAt', () => {
			it('should invalidate if createdAt is not date', () => {
				// @ts-expect-error test error case
				task.createdAt = 'date'
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})

			it('should invalidate if createdAt is undefined', () => {
				delete task.createdAt
				expect(Value.Check(TaskPresenterSchema, task)).toEqual(false)
			})
		})
	})
})
