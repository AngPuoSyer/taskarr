import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ConflictException,
	ExceptionFilter,
	HttpException,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { TypeboxValidationException } from 'nestjs-typebox';
import {
	TaskarrApplicationRuleException,
	TaskarrBusinessRuleException,
	TaskarrException,
	TaskarrInvalidArgumentException,
	TaskarrNotFoundException,
	TaskarrUnauthorizedException
} from '@taskarr/common';
import { RequestExceptionUtil } from './request-exception.factory';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
	catch(exception: TaskarrException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		const error: HttpException = this.getHttpException(exception);

		RequestExceptionUtil.logRequestError({
			error,
			exception,
			path: request.path,
			data: {
				propertyId: request.headers['x-property-id'],
			},
		});

		response.status(error.getStatus()).json({
			ok: false,
			error: error.getResponse(),
		});
	}

	/**
	 * Converts application exception to http exception
	 * @param exception Application exception
	 * @returns {HttpException}
	 */
	private getHttpException(
		exception: TaskarrException
	): HttpException {

		if (exception instanceof TypeboxValidationException) {
			return RequestExceptionUtil.validationExceptionFactory(exception);
		}

		if (exception instanceof HttpException) {
			return exception;
		}

		if (exception instanceof TaskarrUnauthorizedException) {
			return new UnauthorizedException();
		}

		if (exception instanceof TaskarrInvalidArgumentException) {
			return new BadRequestException(exception.message);
		}

		if (exception instanceof TaskarrNotFoundException) {
			return new NotFoundException(exception.message);
		}

		if (exception instanceof TaskarrApplicationRuleException) {
			return new ConflictException(exception.message);
		}

		if (exception instanceof TaskarrBusinessRuleException) {
			return new ConflictException(exception.message);
		}

		return new InternalServerErrorException();
	}
}
