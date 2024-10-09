/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BadRequestException,
	ConflictException,
	HttpException,
	Logger,
	NotFoundException
} from '@nestjs/common';
import type { ValueError } from '@sinclair/typebox/errors';
import { TypeboxValidationException } from 'nestjs-typebox';

export type TypeboxErrorResponse = {
	errors: ValueError[];
};

export class RequestExceptionUtil {
	static validationExceptionFactory(
		error: TypeboxValidationException
	): BadRequestException {
		const errors = (error.getResponse() as TypeboxErrorResponse).errors;
		const errorResponse =
			RequestExceptionUtil.getValidationErrorPath(errors);
		return new BadRequestException(errorResponse);
	}

	static getValidationErrorPath(errors: ValueError[]): any {
		const errorMap = new Map();

		for (const error of errors) {
			console.log(error)
			const path = error.path;
			const val = errorMap.get(path);
			if (val === undefined) {
				errorMap.set(path, [error.message]);
			} else {
				val.push(error.message);
			}
		}

		const errorResponse = [...errorMap.entries()].map(([key, value]) => {
			return {
				path: key,
				errors: value
			};
		});

		return errorResponse;
	}

	static logRequestError<TError = HttpException, TException = unknown>(params: {
		error: TError;
		exception: TException;
		path: string;
		data: any;
	}) {
		const { error, exception, path, data } = params;

		if (error instanceof NotFoundException) {
			return;
		}

		const xpath = RequestExceptionUtil.getDirectoryFromPath(path);

		if (error instanceof BadRequestException) {
			return Logger.debug(exception, xpath, data);
		}

		if (error instanceof ConflictException) {
			return Logger.warn(exception, xpath, data);
		}

		return Logger.error(exception, xpath, data);
	}

	static getDirectoryFromPath(path: string) {
		return path.substring(1).replace(/\//g, '.');
	}
}
