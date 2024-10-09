import {
	BadRequestException,
	ConflictException,
	Controller,
	INestApplication,
	InternalServerErrorException,
	NotFoundException,
	Post,
	UnauthorizedException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseExceptionFilter } from './response-exception.filter';
import request from 'supertest';
import {
	TaskarrApplicationRuleException,
	TaskarrBusinessRuleException,
	TaskarrInvalidArgumentException,
	TaskarrNotFoundException,
	TaskarrUnauthorizedException
} from '@taskarr/common';
import { TypeboxValidationException } from 'nestjs-typebox';
import type { ValueErrorIterator } from '@sinclair/typebox/errors';
import type { TSchema } from '@sinclair/typebox';
import { RequestExceptionUtil } from './request-exception.factory';

const typeboxError = {
	type: 0,
	schema: {} as TSchema,
	path: '/arr',
	value: 2,
	message: 'Expected array'
};
@Controller()
class TestController {
	@Post('typebox')
	typebox() {
		throw new TypeboxValidationException('body', [
			typeboxError
		] as unknown as ValueErrorIterator);
	}

	@Post('http')
	http() {
		throw new ConflictException('message');
	}

	@Post('TaskarrUnauthorizedException')
	unauthorize() {
		throw new TaskarrUnauthorizedException('message');
	}

	@Post('TaskarrInvalidArgumentException')
	invalidArgument() {
		throw new TaskarrInvalidArgumentException('message');
	}

	@Post('TaskarrNotFoundException')
	notFound() {
		throw new TaskarrNotFoundException('message');
	}

	@Post('TaskarrApplicationRuleException')
	applicationRule() {
		throw new TaskarrApplicationRuleException('message');
	}

	@Post('TaskarrBusinessRuleException')
	businessRule() {
		throw new TaskarrBusinessRuleException('message');
	}

	@Post('error')
	internal() {
		throw new Error('message');
	}
}

describe(ResponseExceptionFilter, () => {
	let app: INestApplication;

	beforeEach(async () => {
		jest.resetAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [TestController]
		}).compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new ResponseExceptionFilter());

		jest.spyOn(RequestExceptionUtil, 'logRequestError').mockReturnValue(
			undefined
		);
		jest.spyOn(RequestExceptionUtil, 'validationExceptionFactory');

		await app.init();
	});

	afterEach(() => {
		app.close();
	});

	const suites = [
		{
			httpException: new BadRequestException([
				{
					path: '/arr',
					errors: ['Expected array']
				}
			]),
			appException: new TypeboxValidationException('body', [
				typeboxError
			] as unknown as ValueErrorIterator),
			path: 'typebox'
		},
		{
			httpException: new ConflictException('message'),
			appException: new ConflictException('message'),
			path: 'http'
		},
		{
			httpException: new UnauthorizedException(),
			appException: new TaskarrUnauthorizedException('message'),
			path: 'TaskarrUnauthorizedException'
		},
		{
			httpException: new BadRequestException('message'),
			appException: new TaskarrInvalidArgumentException('message'),
			path: 'TaskarrInvalidArgumentException'
		},
		{
			httpException: new NotFoundException('message'),
			appException: new TaskarrNotFoundException('message'),
			path: 'TaskarrNotFoundException'
		},
		{
			httpException: new ConflictException('message'),
			appException: new TaskarrApplicationRuleException('message'),
			path: 'TaskarrApplicationRuleException'
		},
		{
			httpException: new ConflictException('message'),
			appException: new TaskarrBusinessRuleException('message'),
			path: 'TaskarrBusinessRuleException'
		},
		{
			httpException: new InternalServerErrorException(),
			appException: new Error('message'),
			path: 'error'
		}
	];

	suites.forEach(({ httpException, appException, path }) => {
		it(`should return ${httpException.constructor.name} for ${appException.constructor.name}`, async () => {
			await request(app.getHttpServer())
				.post(`/${path}`)
				.set('x-property-id', '100000000000000000000000')
				.expect(httpException.getStatus())
				.expect({
					ok: false,
					error: httpException.getResponse()
				});

			expect(RequestExceptionUtil.logRequestError).toBeCalledWith({
				error: httpException,
				exception: appException,
				path: `/${path}`,
				data: {
					propertyId: '100000000000000000000000'
				}
			});
		});
	});
});
