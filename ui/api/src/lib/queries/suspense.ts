// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { DefaultService } from "../requests/services.gen";
import * as Common from "./common";
export const useDefaultServiceTaskControllerGetTaskSuspense = <TData = Common.DefaultServiceTaskControllerGetTaskDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceTaskControllerGetTaskKeyFn({ id }, queryKey), queryFn: () => DefaultService.taskControllerGetTask({ id }) as TData, ...options });
export const useDefaultServiceTasksControllerGetTasksSuspense = <TData = Common.DefaultServiceTasksControllerGetTasksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ query, sortBy, sortOrder }: {
  query?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate";
  sortOrder?: "asc" | "desc";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceTasksControllerGetTasksKeyFn({ query, sortBy, sortOrder }, queryKey), queryFn: () => DefaultService.tasksControllerGetTasks({ query, sortBy, sortOrder }) as TData, ...options });
