import { Controller } from "@nestjs/common";
import { TaskPresenterMapper, TaskPresenterSchema, TaskService } from "@taskarr/task";
import { generateSuccessResponseSchema } from "../../utils/presenter.util";
import { Type } from "@taskarr/typebox";
import { HttpEndpointWithDefault } from "../../decorator/http-endpoint-with-default.decorator";

const GetTasksResponseDtoSchema = generateSuccessResponseSchema(Type.ClosedObject({
	tasks: Type.Array(TaskPresenterSchema)
}))

@Controller('tasks')
export class TasksController {
	constructor(
		private readonly taskService: TaskService
	) { }

	@HttpEndpointWithDefault({
		path: '/',
		method: 'GET',
		validate: {
			response: {
				schema: GetTasksResponseDtoSchema,
				stripUnknownProps: true
			}
		}
	})
	async getTasks() {
		const tasks = await this.taskService.getTasks()

		return { ok: true, data: { tasks: tasks.map(task => TaskPresenterMapper.fromDomain(task)) } }
	}
}
