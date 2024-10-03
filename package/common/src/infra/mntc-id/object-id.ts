import { ObjectId as BSONObjectId } from 'bson';

export class ObjectId {
	static create(id?: string) {
		return Buffer.from(new BSONObjectId(id).id);
	}
}
