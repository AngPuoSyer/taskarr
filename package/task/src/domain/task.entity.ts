import { TaskId } from './task-id.value-object'
import { TaskProps, TaskStatus } from './types'

const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000

export class TaskEntity {
	isNew = false
	constructor(public props: TaskProps, options?: { isNew?: true }) {
		if (options?.isNew === true) {
			this.isNew = true
		}
	}

	created() {
		this.isNew = false
	}

	static create(props: TaskProps): TaskEntity {
		return new TaskEntity(props)
	}

	static createNew(props: Omit<TaskProps, 'id' | 'createdAt' | 'updatedAt'>): TaskEntity {
		return new TaskEntity({
			...props,
			createdAt: new Date(),
			updatedAt: new Date(),
			id: TaskId.create().value,
		}, { isNew: true })
	}

	getStatus() {
		if (this.props.dueDate === undefined) {
			return TaskStatus.notUrgent
		}

		const dueDate = this.props.dueDate.getTime()
		const now = Date.now()

		if (dueDate - now < 0) {
			return TaskStatus.overDue
		}

		if (dueDate - now < sevenDaysInMillis) {
			return TaskStatus.dueSoon
		}

		return TaskStatus.notUrgent
	}
}
