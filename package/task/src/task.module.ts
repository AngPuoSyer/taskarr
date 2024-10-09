import { Module } from "@nestjs/common";
import { TaskRepository } from "./infra/repository/task.repository";
import { TaskService } from "./application/task.service";

@Module({
	providers: [TaskRepository, TaskService],
	// only expose the application layer to the consumer
	// infra are kept hidden from the consumer to prevent direct access
	// and changes of infra will not affect the consumer
	exports: [TaskService],
})
export class TaskModule { }
