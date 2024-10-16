// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { type QueryClient } from "@tanstack/react-query";
import { DefaultService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseDefaultServiceTaskControllerGetTask = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceTaskControllerGetTaskKeyFn({ id }), queryFn: () => DefaultService.taskControllerGetTask({ id }) });
export const prefetchUseDefaultServiceTasksControllerGetTasks = (queryClient: QueryClient, { query, sortBy, sortOrder }: {
  query?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate";
  sortOrder?: "asc" | "desc";
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceTasksControllerGetTasksKeyFn({ query, sortBy, sortOrder }), queryFn: () => DefaultService.tasksControllerGetTasks({ query, sortBy, sortOrder }) });
