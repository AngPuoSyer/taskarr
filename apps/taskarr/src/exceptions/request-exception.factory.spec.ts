import {
	BadRequestException,
	ConflictException,
	Logger,
	NotFoundException
} from '@nestjs/common';

import { RequestExceptionUtil } from './request-exception.factory';
import { TypeboxValidationException } from 'nestjs-typebox';
import { TSchema } from '@sinclair/typebox';
import type { ValueError, ValueErrorIterator } from '@sinclair/typebox/errors';

describe(RequestExceptionUtil, () => {
	beforeEach(function () {
		jest.restoreAllMocks();
	});

	const errors: ValueError[] = [
		{
			type: 0,
			schema: {} as TSchema,
			path: '/arr',
			value: 2,
			message: 'Expected array'
		},
		{
			type: 43,
			schema: {} as TSchema,
			path: '/arr',
			value: 2,
			message: 'Expected required'
		},
		{
			type: 43,
			schema: {} as TSchema,
			path: '/arr/0/a',
			value: 2,
			message: 'Expected string'
		},
		{
			type: 25,
			schema: {} as TSchema,
			path: '/arr/0/b/bar',
			value: '1',
			message: "Expected 'baz'"
		},
		{
			type: 38,
			schema: {} as TSchema,
			path: '/arr/0/c',
			value: 'any',
			message: 'Unexpected property'
		},
		{
			type: 38,
			schema: {} as TSchema,
			path: '/add',
			value: '1',
			message: 'Unexpected property'
		}
	];

	describe(RequestExceptionUtil.getDirectoryFromPath, () => {
		it('should return BadRequestException derived from first ValidationError', () => {
			jest.spyOn(RequestExceptionUtil, 'getValidationErrorPath');

			const exception = RequestExceptionUtil.validationExceptionFactory(
				new TypeboxValidationException(
					'body',
					errors as unknown as ValueErrorIterator
				)
			);

			expect(exception).toBeInstanceOf(BadRequestException);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect((exception.getResponse() as any).message).toEqual(
				(RequestExceptionUtil.getValidationErrorPath as jest.Mock).mock
					.results[0].value
			);
		});
	});

	describe(RequestExceptionUtil.getValidationErrorPath, () => {
		it('should collapse error messages', () => {
			expect(RequestExceptionUtil.getValidationErrorPath(errors)).toEqual(
				[
					{
						path: '/arr',
						errors: ['Expected array', 'Expected required']
					},
					{ path: '/arr/0/a', errors: ['Expected string'] },
					{ path: '/arr/0/b/bar', errors: ["Expected 'baz'"] },
					{ path: '/arr/0/c', errors: ['Unexpected property'] },
					{ path: '/add', errors: ['Unexpected property'] }
				]
			);
		});
	});

	describe(RequestExceptionUtil.logRequestError, () => {
		const params = {
			exception: new Error('test exception'),
			path: 'path',
			data: {
				propertyId: '100000000000000000000000'
			}
		};

		beforeEach(() => {
			jest.spyOn(
				RequestExceptionUtil,
				'getDirectoryFromPath'
			).mockReturnValue('xpath');
			jest.spyOn(Logger, 'debug').mockReturnValue(undefined);
			jest.spyOn(Logger, 'warn').mockReturnValue(undefined);
			jest.spyOn(Logger, 'error').mockReturnValue(undefined);
		});

		it('should not log for NotFoundException', () => {
			const error = new NotFoundException();

			RequestExceptionUtil.logRequestError({
				error,
				...params
			});

			expect(Logger.debug).not.toBeCalled();
			expect(Logger.warn).not.toBeCalled();
			expect(Logger.error).not.toBeCalled();
		});

		it('should log debug for BadRequestException', () => {
			const error = new BadRequestException('message');

			RequestExceptionUtil.logRequestError({
				error,
				...params
			});

			expect(Logger.debug).toBeCalledTimes(1);
			expect(Logger.debug).toBeCalledWith(params.exception, 'xpath', {
				propertyId: '100000000000000000000000'
			});

			expect(Logger.warn).not.toBeCalled();
			expect(Logger.error).not.toBeCalled();
		});

		it('should log debug for ConflictException', () => {
			const error = new ConflictException('message');

			RequestExceptionUtil.logRequestError({
				error,
				...params
			});

			expect(Logger.warn).toBeCalledTimes(1);
			expect(Logger.warn).toBeCalledWith(params.exception, 'xpath', {
				propertyId: '100000000000000000000000'
			});

			expect(Logger.debug).not.toBeCalled();
			expect(Logger.error).not.toBeCalled();
		});

		it('should log debug for any other error', () => {
			const error = new Error('message');

			RequestExceptionUtil.logRequestError({
				error,
				...params
			});

			expect(Logger.error).toBeCalledTimes(1);
			expect(Logger.error).toBeCalledWith(params.exception, 'xpath', {
				propertyId: '100000000000000000000000'
			});

			expect(Logger.debug).not.toBeCalled();
			expect(Logger.warn).not.toBeCalled();
		});
	});

	describe(RequestExceptionUtil.getDirectoryFromPath, () => {
		it('should get xpath directory based on request path', () => {
			expect(
				RequestExceptionUtil.getDirectoryFromPath('/path/to/request')
			).toEqual('path.to.request');
		});
	});
});
