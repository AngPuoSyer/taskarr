import {
	ObjectOptions,
	TProperties,
	Type as OriginalType,
	TObject,
	type Static as OriginalStatic,
	type TSchema,
	type TUnion,
	type TComposite,
	Kind,
	TString,
} from '@sinclair/typebox';
import { IsArray, IsObject, Value } from '@sinclair/typebox/value'
import { JavaScriptTypeBuilder } from '@sinclair/typebox/type'

import { TypeSystem } from '@sinclair/typebox/system';


type TCompositeUnion<
	T extends TSchema[],
	U extends TObject,
	Acc extends TSchema[] = []
> = T extends [infer L extends TObject, ...infer R extends TSchema[]]
	? TCompositeUnion<R, U, [...Acc, TComposite<[L, U]>]>
	: TUnion<Acc>;

export class CustomTypeBuilder extends JavaScriptTypeBuilder {
	ClosedObject<T extends TProperties>(
		properties: T,
		options: ObjectOptions = {}
	) {
		return OriginalType.Object(properties, {
			...options,
			additionalProperties: false,
		});
	}

	ClosedComposite<T extends TObject[]>(
		objects: [...T],
		options: ObjectOptions = {}
	) {
		return OriginalType.Composite(objects, {
			...options,
			additionalProperties: false,
		});
	}

	CompositeUnion<T extends TObject[], U extends TObject>(
		t: [...T],
		u: U,
		options: ObjectOptions = {}
	): TCompositeUnion<T, U> {
		return OriginalType.Union(
			t.map((schema) => OriginalType.Composite([schema, u], options))
		) as never;
	}

	ClosedCompositeUnion<T extends TObject[], U extends TObject>(
		t: [...T],
		u: U,
		options: ObjectOptions = {}
	): TCompositeUnion<T, U> {
		return OriginalType.Union(
			t.map((schema) =>
				OriginalType.Composite([schema, u], {
					...options,
					additionalProperties: false,
				})
			)
		) as never;
	}
}

export const Type = new CustomTypeBuilder();
export type Static<
	T extends TSchema,
	P extends unknown[] = []
> = OriginalStatic<T, P>;

export function TrimString(schema: TSchema, value: unknown) {
	const trimSchema: TSchema = WalkRecursive(
		schema,
		[],
		(value) => {
			if (IsObject(value) && value[Kind] === 'String') {
				return Type.Transform(value as never as TString)
					.Decode((value) => value.trim())
					.Encode((value) => value.trim());
			}
			return value;
		}
	) as never;
	try {
		// might break if they have custom encode decode function
		return Value.Encode(trimSchema, value);
	} catch {
		return value;
	}
}

// https://github.com/sinclairzx81/typebox/issues/752#issuecomment-1932902505
export function Clean(schema: TSchema, value: unknown) {
	const discarded = WalkRecursive(
		schema,
		['additionalProperties'],
		(value, keys) => keys.reduce((acc, key) => DiscardKey(acc, key), value)
	);
	return Value.Clean(discarded as unknown as TSchema, value);
}

function DiscardKey(value: unknown, key: PropertyKey): unknown {
	// patch older-typebox date soo that clean works in newer-typebox
	if (IsObject(value) && value[Kind] === 'Date') {
		value.type = 'Date';
		delete value.instanceOf;
	}
	if (!IsObject(value) || IsArray(value)) {
		return value;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { [key]: _, ...rest } = value;
	return rest;
}
function WalkRecursive<T>(
	value: T,
	keys: PropertyKey[],
	handler: (value: unknown, keys: PropertyKey[]) => unknown
): T {
	const discarded = handler(value, keys);
	if (IsArray(discarded)) {
		return discarded.map((value) =>
			WalkRecursive(value as T, keys, handler)
		) as T;
	}
	if (IsObject(discarded)) {
		return Object.fromEntries(
			[
				Object.getOwnPropertyNames(discarded).map((key) => [
					key,
					WalkRecursive(discarded[key], keys, handler),
				]),
				Object.getOwnPropertySymbols(discarded).map((key) => [
					key,
					WalkRecursive(discarded[key] as T, keys, handler),
				]),
			].flat()
		);
	}
	return discarded as T;
}

/**
 * Taken from https://github.com/sinclairzx81/typebox/tree/master/example/formats
 */
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

function IsLeapYear(year: number): boolean {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function IsDate(value: string): boolean {
	const matches: string[] | null = DATE.exec(value);
	if (!matches) return false;
	const year: number = +matches[1];
	const month: number = +matches[2];
	const day: number = +matches[3];
	return (
		month >= 1 &&
		month <= 12 &&
		day >= 1 &&
		day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month])
	);
}

const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

export function IsTime(value: string, strictTimeZone?: boolean): boolean {
	const matches: string[] | null = TIME.exec(value);
	if (!matches) return false;
	const hr: number = +matches[1];
	const min: number = +matches[2];
	const sec: number = +matches[3];
	const tz: string | undefined = matches[4];
	const tzSign: number = matches[5] === '-' ? -1 : 1;
	const tzH: number = +(matches[6] || 0);
	const tzM: number = +(matches[7] || 0);
	if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) return false;
	if (hr <= 23 && min <= 59 && sec < 60) return true;
	const utcMin = min - tzM * tzSign;
	const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
	return (
		(utcHr === 23 || utcHr === -1) &&
		(utcMin === 59 || utcMin === -1) &&
		sec < 61
	);
}

const DATE_TIME_SEPARATOR = /t|\s/i;

export function IsDateTime(value: string, strictTimeZone?: boolean): boolean {
	const dateTime: string[] = value.split(DATE_TIME_SEPARATOR);
	return (
		dateTime.length === 2 &&
		IsDate(dateTime[0]) &&
		IsTime(dateTime[1], strictTimeZone)
	);
}

// Alternative for faster validation
// const AJV_FAST_DATE_TIME_FORMAT =
// 	/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i;

TypeSystem.Format('date-time', (value) => IsDateTime(value, true));
