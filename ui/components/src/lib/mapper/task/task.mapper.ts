import { GetTaskResponse } from "@taskarr/ui/api";

export function mapTaskStatus(status: GetTaskResponse['data']['task']['status']) {
	switch (status) {
		case 0:
			return 'Not Urgent';
		case 1:
			return 'Due Soon';
		case 2:
			return 'Overdue';
		default:
			throw new Error('Invalid status');
	}
}
