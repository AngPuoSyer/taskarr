import { TSchema } from "@sinclair/typebox";
import { Static, Type } from "@taskarr/typebox";


export const ResponseSuccessSchema = Type.ClosedObject({
	ok: Type.Literal(true),
})

export type ResponseSuccess = Static<typeof ResponseSuccessSchema>

export function generateSuccessResponseSchema(schema: TSchema): TSchema {
	return Type.ClosedComposite([
		ResponseSuccessSchema,
		Type.ClosedObject({
			data: schema
		})
	])
}
