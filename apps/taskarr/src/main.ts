/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ResponseExceptionFilter } from './exceptions/response-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from '@nicholas.braun/nestjs-redoc';
import { patchNestJsSwagger } from 'nestjs-typebox';

patchNestJsSwagger()

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = 'api';
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	app.enableCors();
	app.setGlobalPrefix(globalPrefix);
	app.useGlobalFilters(new ResponseExceptionFilter());

	const config = new DocumentBuilder()
		.setTitle('Taskarr API')
		.setDescription('API for Taskarr')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	await RedocModule.setup('/docs', app as never, document, {});

	const port = process.env.PORT || 3000;
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
