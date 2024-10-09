import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	SetMetadata,
	UseInterceptors,
	applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Value } from '@sinclair/typebox/value';
import { HttpEndpoint, HttpEndpointDecoratorConfig } from 'nestjs-typebox';
import { Observable, map } from 'rxjs';
import { Clean } from '@taskarr/typebox'

const TYPEBOX_DEFAULT_DECORATOR_SCHEMA = 'TYPEBOX_DEFAULT_DECORATOR_SCHEMA';

@Injectable()
export class TypeboxDefaultValueInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) { }

	async intercept(
		context: ExecutionContext,
		next: CallHandler
	): Promise<Observable<unknown>> {
		const { bodySchema, responseSchema } =
			this.reflector.get(
				TYPEBOX_DEFAULT_DECORATOR_SCHEMA,
				context.getHandler()
			) ?? {};
		const req = context.switchToHttp().getRequest();
		if (bodySchema) req.body = Value.Default(bodySchema, req.body);
		return next.handle().pipe(
			map((result) => {
				if (!responseSchema) {
					return result;
				}
				return Clean(responseSchema, result);
			})
		);
	}
}

export function HttpEndpointWithDefault(config: HttpEndpointDecoratorConfig) {
	const bodyFoundSchema = config.validate?.request?.find(
		(schema) => schema.type === 'body'
	)?.schema;
	const responseFoundSchema = config.validate?.response?.stripUnknownProps
		? config.validate.response.schema
		: undefined;
	return applyDecorators(
		<MethodDecorator>HttpEndpoint(config),
		UseInterceptors(TypeboxDefaultValueInterceptor),
		SetMetadata(TYPEBOX_DEFAULT_DECORATOR_SCHEMA, {
			bodySchema: bodyFoundSchema,
			responseSchema: responseFoundSchema,
		})
	);
}
