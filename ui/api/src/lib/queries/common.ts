// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseQueryResult } from "@tanstack/react-query";
import { DefaultService } from "../requests/services.gen";
export type DefaultServiceTaskControllerGetTaskDefaultResponse = Awaited<ReturnType<typeof DefaultService.taskControllerGetTask>>;
export type DefaultServiceTaskControllerGetTaskQueryResult<TData = DefaultServiceTaskControllerGetTaskDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceTaskControllerGetTaskKey = "DefaultServiceTaskControllerGetTask";
export const UseDefaultServiceTaskControllerGetTaskKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useDefaultServiceTaskControllerGetTaskKey, ...(queryKey ?? [{ id }])];
export type DefaultServiceTasksControllerGetTasksDefaultResponse = Awaited<ReturnType<typeof DefaultService.tasksControllerGetTasks>>;
export type DefaultServiceTasksControllerGetTasksQueryResult<TData = DefaultServiceTasksControllerGetTasksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceTasksControllerGetTasksKey = "DefaultServiceTasksControllerGetTasks";
export const UseDefaultServiceTasksControllerGetTasksKeyFn = ({ query, sortBy, sortOrder }: {
  query?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate";
  sortOrder?: "asc" | "desc";
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceTasksControllerGetTasksKey, ...(queryKey ?? [{ query, sortBy, sortOrder }])];
export type DefaultServiceTaskControllerCreateTaskMutationResult = Awaited<ReturnType<typeof DefaultService.taskControllerCreateTask>>;
export type DefaultServiceTaskControllerUpdateTaskMutationResult = Awaited<ReturnType<typeof DefaultService.taskControllerUpdateTask>>;
export type DefaultServiceTaskControllerDeleteTaskMutationResult = Awaited<ReturnType<typeof DefaultService.taskControllerDeleteTask>>;
