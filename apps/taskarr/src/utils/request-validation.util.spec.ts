import { Type } from "@taskarr/typebox"
import { mapParamSchema } from "./request-validation.util"

describe('request-validation.util', () => {
	describe('mapParamSchema', () => {
		it('should return an array of ParamValidatorConfig', () => {
			const schemaStore = {
				id: Type.Number(),
				name: Type.String(),
			}

			const result = mapParamSchema(schemaStore)

			expect(result).toEqual([
				{
					type: 'param',
					name: 'id',
					schema: Type.Number(),
				},
				{
					type: 'param',
					name: 'name',
					schema: Type.String(),
				},
			])
		})
	})

})
