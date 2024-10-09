// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { type QueryClient } from "@tanstack/react-query";
import { DefaultService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseDefaultServiceTaskControllerGetTask = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceTaskControllerGetTaskKeyFn({ id }), queryFn: () => DefaultService.taskControllerGetTask({ id }) });
export const prefetchUseDefaultServiceTasksControllerGetTasks = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceTasksControllerGetTasksKeyFn(), queryFn: () => DefaultService.tasksControllerGetTasks() });
