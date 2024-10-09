import { TaskEntity } from "./task.entity";
import { TaskStatus } from "./types";

describe(TaskEntity, () => {
	describe('getStatus', () => {
		it('should return notUrgent if dueDate is undefined', () => {
			const task = new TaskEntity({
				id: '123',
				name: 'task',
				description: 'description',
				dueDate: undefined,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			expect(task.getStatus()).toBe(TaskStatus.notUrgent)
		})

		it('should return overDue if dueDate is in the past', () => {
			const task = new TaskEntity({
				id: '123',
				name: 'task',
				description: 'description',
				dueDate: new Date('2020-01-01'),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			expect(task.getStatus()).toBe(TaskStatus.overDue)
		})

		it('should return dueSoon if dueDate is within 7 days', () => {
			const task = new TaskEntity({
				id: '123',
				name: 'task',
				description: 'description',
				dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			expect(task.getStatus()).toBe(TaskStatus.dueSoon)
		})

		it('should return notUrgent if dueDate is more than 7 days away', () => {
			const task = new TaskEntity({
				id: '123',
				name: 'task',
				description: 'description',
				dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			expect(task.getStatus()).toBe(TaskStatus.notUrgent)
		})
	})
})
