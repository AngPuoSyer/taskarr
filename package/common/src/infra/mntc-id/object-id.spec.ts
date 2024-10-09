import { Value } from '@sinclair/typebox/value'
import { ObjectId, ObjectIdSchema } from './object-id'
describe(ObjectId, () => {
	describe('.create', () => {
		it('should create object id buffer from a string', () => {
			const id = '1'.repeat(24)
			const objectId = ObjectId.create(id)
			expect(objectId).toBeInstanceOf(Buffer)
			expect(objectId.toString('hex')).toBe(id)
		})

		it('should generate a random id if no id is provided', () => {
			const objectId = ObjectId.create()
			expect(objectId).toBeInstanceOf(Buffer)
			expect(objectId.toString('hex')).toHaveLength(24)
		})
	})

	describe('schema', () => {
		it('should validate if objectId is in valid object id format', () => {
			const id = '1234567890ABCDEF00000000'
			expect(Value.Check(ObjectIdSchema, id)).toBe(true)
		})
	})
})
