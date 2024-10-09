import { ObjectId as BSONObjectId } from 'bson';
import { Type } from '@taskarr/typebox'

export const ObjectIdSchema = Type.String({
	minLength: 24,
	maxLength: 24,
	pattern: '^[a-fA-F0-9]{24}$',
	description: 'MongoDB ObjectID'
});

export class ObjectId {
	static create(id?: string) {
		return Buffer.from(new BSONObjectId(id).id);
	}
}
