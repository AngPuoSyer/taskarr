import { TaskEntity } from '../../domain/task.entity'
import { TaskPresenterMapper } from './task.presenter.mapper'

describe(TaskPresenterMapper, () => {
	describe('.toCreateTask', () => {
		it('should map task to create task', () => {
			const task = {
				name: 'Task 1',
				description: 'Description',
				dueDate: new Date().toISOString()
			}
			const createTask = TaskPresenterMapper.toCreateTask(task)
			expect(createTask).toEqual({
				name: 'Task 1',
				description: 'Description',
				dueDate: new Date(task.dueDate)
			})
		})
	})

	describe('.fromDomain', () => {
		it('should map TaskEntity to task', () => {
			const id = '1'.repeat(24)
			const props = {
				id: id,
				name: 'Task 1',
				description: 'Description',
				dueDate: new Date(),
				createdAt: new Date(),
				updatedAt: new Date()
			}
			const taskEntity = TaskEntity.create(props)
			const task = TaskPresenterMapper.fromDomain(taskEntity)
			expect(task).toEqual({
				id: id,
				name: 'Task 1',
				description: 'Description',
				dueDate: taskEntity.props.dueDate,
				createdAt: taskEntity.props.createdAt,
				updatedAt: taskEntity.props.updatedAt
			})
		})
	})
})
