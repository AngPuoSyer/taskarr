import { Body, Controller, Param } from "@nestjs/common";
import { HttpEndpointWithDefault } from "../../decorator/http-endpoint-with-default.decorator";
import { Static, Type } from "@taskarr/typebox";
import { TaskPresenterMapper, TaskPresenterSchema, TaskService } from "@taskarr/task";
import { TaskSchemaStore } from "package/task/src/domain/types";
import { mapParamSchema } from "../../utils/request-validation.util";
import { generateSuccessResponseSchema } from "../../utils/presenter.util";

// TODO: move to a common place
const dateInputSchema = Type.String({ format: 'date-time' })

const GetTaskDtoSchemaStore = {
	id: TaskSchemaStore.id
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GetTaskDtoSchema = Type.ClosedObject(GetTaskDtoSchemaStore)
export type GetTaskDto = Static<typeof GetTaskDtoSchema>

const GetTaskResponseDtoSchema = generateSuccessResponseSchema(
	Type.ClosedObject({
		task: TaskPresenterSchema
	})
)
export type GetTaskResponseDto = Static<typeof GetTaskResponseDtoSchema>

const CreateTaskDtoSchema = Type.ClosedObject({
	name: TaskSchemaStore.name,
	description: Type.Optional(TaskSchemaStore.description),
	dueDate: Type.Optional(dateInputSchema),
})
export type CreateTaskDto = Static<typeof CreateTaskDtoSchema>


const CreateTaskResponseDtoSchema = generateSuccessResponseSchema(
	Type.ClosedObject({
		task: TaskPresenterSchema
	})
)
export type CreateTaskResponseDto = Static<typeof CreateTaskResponseDtoSchema>
@Controller('task')
export class TaskController {
	constructor(
		private readonly taskService: TaskService
	) { }

	@HttpEndpointWithDefault({
		method: 'POST',
		validate: {
			request: [{
				type: 'body',
				schema: CreateTaskDtoSchema
			}],
			response: {
				schema: CreateTaskResponseDtoSchema,
				stripUnknownProps: true
			}
		},
		responseCode: 200,
	})
	async createTask(@Body() dto: CreateTaskDto): Promise<CreateTaskResponseDto> {
		const entity = await this.taskService.createTask({
			name: dto.name,
			description: dto.description,
			dueDate: this.mapDueDate(dto.dueDate),
		})

		return { ok: true, data: { task: TaskPresenterMapper.fromDomain(entity) } }
	}


	@HttpEndpointWithDefault({
		method: 'GET',
		path: ':id',
		responseCode: 200,
		validate: {
			request: mapParamSchema(GetTaskDtoSchemaStore),
			response: {
				schema: GetTaskResponseDtoSchema,
				stripUnknownProps: true
			}
		}
	})
	async getTask(@Param('id') taskId: GetTaskDto['id']): Promise<GetTaskResponseDto> {
		const entity = await this.taskService.getTask({ id: taskId })

		return {
			ok: true, data: { task: TaskPresenterMapper.fromDomain(entity) }
		}
	}

	mapDueDate(dueDate: string | null) {
		return dueDate ? new Date(dueDate) : dueDate as null | undefined
	}
}
