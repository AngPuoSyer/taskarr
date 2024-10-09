import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskModule as TaskLibModule } from "@taskarr/task";
import { TasksController } from "./tasks.controller";

@Module({
	imports: [TaskLibModule],
	controllers: [TaskController, TasksController],
	providers: []
})
export class TaskModule { }
