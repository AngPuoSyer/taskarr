// generated with @7nohe/openapi-react-query-codegen@1.6.1 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { DefaultService } from "../requests/services.gen";
import { CreateTaskBody, UpdateTaskBody } from "../requests/types.gen";
import * as Common from "./common";
export const useDefaultServiceTaskControllerGetTask = <TData = Common.DefaultServiceTaskControllerGetTaskDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceTaskControllerGetTaskKeyFn({ id }, queryKey), queryFn: () => DefaultService.taskControllerGetTask({ id }) as TData, ...options });
export const useDefaultServiceTasksControllerGetTasks = <TData = Common.DefaultServiceTasksControllerGetTasksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ query, sortBy, sortOrder }: {
  query?: string;
  sortBy?: "createdAt" | "updatedAt" | "dueDate";
  sortOrder?: "asc" | "desc";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceTasksControllerGetTasksKeyFn({ query, sortBy, sortOrder }, queryKey), queryFn: () => DefaultService.tasksControllerGetTasks({ query, sortBy, sortOrder }) as TData, ...options });
export const useDefaultServiceTaskControllerCreateTask = <TData = Common.DefaultServiceTaskControllerCreateTaskMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateTaskBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateTaskBody;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.taskControllerCreateTask({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceTaskControllerUpdateTask = <TData = Common.DefaultServiceTaskControllerUpdateTaskMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: UpdateTaskBody;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: UpdateTaskBody;
}, TContext>({ mutationFn: ({ id, requestBody }) => DefaultService.taskControllerUpdateTask({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceTaskControllerDeleteTask = <TData = Common.DefaultServiceTaskControllerDeleteTaskMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => DefaultService.taskControllerDeleteTask({ id }) as unknown as Promise<TData>, ...options });
