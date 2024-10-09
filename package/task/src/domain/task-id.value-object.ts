import { ObjectId } from '@taskarr/common'

export class TaskId {
	private _value: Buffer;
	constructor(_value?: string) {
		this._value = ObjectId.create(_value)
	}

	static create(id?: string): TaskId {
		return new TaskId(id)
	}

	get value() {
		return this._value.toString('hex');
	}
}
