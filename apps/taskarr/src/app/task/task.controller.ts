import { Body, Controller, Param } from "@nestjs/common";
import { HttpEndpointWithDefault } from "../../decorator/http-endpoint-with-default.decorator";
import { Static, Type } from "@taskarr/typebox";
import { TaskPresenterMapper, TaskPresenterSchema, TaskService } from "@taskarr/task";
import { TaskSchemaStore } from "package/task/src/domain/types";
import { mapParamSchema } from "../../utils/request-validation.util";
import { generateSuccessResponseSchema } from "../../utils/presenter.util";


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
}
