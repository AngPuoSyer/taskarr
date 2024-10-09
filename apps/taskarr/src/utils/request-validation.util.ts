import { TSchema } from "@sinclair/typebox";
import { ParamValidatorConfig, QueryValidatorConfig } from "nestjs-typebox";

export function mapParamSchema(schema: Record<string, TSchema>): ParamValidatorConfig[] {
	return Object.entries(schema).map(([key, value]) => ({
		type: 'param',
		name: key,
		schema: value,
	}))
}

export function mapQuerySchema(schema: Record<string, TSchema>): QueryValidatorConfig[] {
	return Object.entries(schema).map(([key, value]) => ({
		type: 'query',
		name: key,
		schema: value,
	}))
}
