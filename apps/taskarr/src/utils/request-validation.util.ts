import { TSchema } from "@sinclair/typebox";
import { ParamValidatorConfig } from "nestjs-typebox";

export function mapParamSchema(schema: Record<string, TSchema>): ParamValidatorConfig[] {
	return Object.entries(schema).map(([key, value]) => ({
		type: 'param',
		name: key,
		schema: value,
	}))
}
