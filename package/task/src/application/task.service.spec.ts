import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from '../infra/repository/task.repository';

jest.mock('../infra/repository/task.repository')

describe(TaskService, () => {
	let service: TaskService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TaskRepository, TaskService],
		}).compile();

		service = module.get<TaskService>(TaskService);
	});

	describe('mapSortField', () => {
		it('should return undefined if sortBy is undefined', () => {
			expect(service.mapSortField(undefined)).toBeUndefined();
		})

		it('should return created_at if sortBy is createdAt', () => {
			expect(service.mapSortField('createdAt')).toBe('created_at');
		})

		it('should return updated_at if sortBy is updatedAt', () => {
			expect(service.mapSortField('updatedAt')).toBe('updated_at');
		})

		it('should return due_date if sortBy is dueDate', () => {
			expect(service.mapSortField('dueDate')).toBe('due_date');
		})

		it('should throw if sortBy is an unknown value', () => {
			expect(() => service.mapSortField('unknown')).toThrow();
		})
	})
})
