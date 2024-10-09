import { Badge, ThemeTypings } from "@chakra-ui/react";
import { GetTaskResponse } from "@taskarr/ui/api";
import { mapTaskStatus } from "../mapper/task/task.mapper";

export interface TaskStatusBadgeProps {
	// TODO: define common frontend type for task
	status: GetTaskResponse['data']['task']['status'];
}

const colorSchemaConfig: Record<GetTaskResponse['data']['task']['status'], ThemeTypings["colorSchemes"]> = {
	0: 'green',
	1: 'yellow',
	2: 'red',

}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
	return (
		<Badge colorScheme={colorSchemaConfig[status]}>
			{mapTaskStatus(status)}
		</Badge>
	)
}
