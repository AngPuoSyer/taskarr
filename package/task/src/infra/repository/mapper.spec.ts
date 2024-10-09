import { TaskEntity } from '../../domain/task.entity'
import { TaskRepositoryMapper } from './mapper'

describe(TaskRepositoryMapper, () => {
	describe('.fromDomain', () => {
		it('should map TaskEntity to Task', () => {
			const id = '1'.repeat(24)
			const taskEntity = new TaskEntity({
				id: id,
				name: 'Task 1',
				description: 'Description',
				dueDate: new Date(),
				createdAt: new Date(),
				updatedAt: new Date()
			})
			const task = TaskRepositoryMapper.fromDomain(taskEntity)
			expect(task).toEqual({
				id: Buffer.from(id, 'hex'),
				name: 'Task 1',
				description: 'Description',
				due_date: taskEntity.props.dueDate,
				created_at: taskEntity.props.createdAt,
				updated_at: taskEntity.props.updatedAt
			})
		})
	})
	describe('.toDomain', () => {
		it('should map Task to TaskEntity', () => {
			const id = '1'.repeat(24)
			const task = {
				id: Buffer.from(id, 'hex'),
				name: 'Task 1',
				description: 'Description',
				due_date: new Date(),
				created_at: new Date(),
				updated_at: new Date()
			}
			const taskEntity = TaskRepositoryMapper.toDomain(task)
			expect(taskEntity).toBeInstanceOf(TaskEntity)
			expect(taskEntity.props).toEqual({
				id: id,
				name: 'Task 1',
				description: 'Description',
				dueDate: task.due_date,
				createdAt: task.created_at,
				updatedAt: task.updated_at
			})
		})
	})
})
