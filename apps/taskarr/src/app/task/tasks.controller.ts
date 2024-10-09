import { Controller, Req } from "@nestjs/common";
import { TaskPresenterMapper, TaskPresenterSchema, TaskService } from "@taskarr/task";
import { generateSuccessResponseSchema } from "../../utils/presenter.util";
import { Type } from "@taskarr/typebox";
import { Static } from "@sinclair/typebox";
import { HttpEndpoint } from "nestjs-typebox";
import { ApiQuery } from "@nestjs/swagger";
import { Value } from "@sinclair/typebox/value";

const TaskSortByField = {
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	dueDate: 'dueDate'
} as const

// TODO: can be abstracted cause common
const TaskSortOrder = {
	asc: 'asc',
	desc: 'desc'
} as const

const GetTasksRequestSchemaStore = {
	query: Type.Optional(Type.String()),
	sortBy: Type.Optional(
		Type.Enum(TaskSortByField, {
			default: TaskSortByField.createdAt
		})
	),
	sortOrder: Type.Optional(
		Type.Enum(TaskSortOrder, {
			default: TaskSortOrder.asc
		})
	)
}

const GetTasksRequestQuerySchema = Type.ClosedObject(GetTasksRequestSchemaStore)
export type GetTasksRequestDto = Static<typeof GetTasksRequestQuerySchema>
const GetTasksResponseDtoSchema = generateSuccessResponseSchema(Type.ClosedObject({
	tasks: Type.Array(TaskPresenterSchema)
}))

@Controller('tasks')
export class TasksController {
	constructor(
		private readonly taskService: TaskService
	) { }

	@HttpEndpoint({
		path: '/',
		method: 'GET',
		validate: {
			response: {
				schema: GetTasksResponseDtoSchema,
				stripUnknownProps: true
			}
		},
	})
	@ApiQuery({
		name: 'sortBy',
		required: false,
		schema: GetTasksRequestSchemaStore.sortBy
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		schema: GetTasksRequestSchemaStore.sortOrder
	})
	@ApiQuery({
		name: 'query',
		required: false,
		schema: GetTasksRequestSchemaStore.query
	})
	async getTasks(@Req() req) {
		// Workaround as query params are not working correctly with the current version of nestjs-typebox
		const query = req.query as unknown as GetTasksRequestDto
		const dto: GetTasksRequestDto = Value.Default(GetTasksRequestQuerySchema, query)

		const tasks = await this.taskService.getTasks({
			query: dto.query,
			sortBy: dto.sortBy,
			sortOrder: dto.sortOrder
		})

		return { ok: true, data: { tasks: tasks.map(task => TaskPresenterMapper.fromDomain(task)) } }
	}
}
