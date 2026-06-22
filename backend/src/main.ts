import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { StructuredLogger } from './utils/logger';

async function bootstrap() {
  const logger = new StructuredLogger();
  logger.setContext('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const corsOrigin = configService.get<string>('app.corsOrigin') ?? '*';

  app.use(helmet());

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('College Discovery Platform API')
    .setDescription(
      'Production-grade API for browsing, comparing, and reviewing Indian colleges',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'User registration, login, and profile')
    .addTag('Colleges', 'Browse, search, and filter colleges')
    .addTag('Reviews', 'College reviews')
    .addTag('Comparisons', 'Compare colleges side-by-side')
    .addTag('Saved Colleges', 'Save and manage favorite colleges')
    .addTag('Discussions', 'Q&A and community discussions about colleges')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.getHttpAdapter().get('/docs-json', (_req, res) => {
    res.json(document);
  });

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/docs`);
  logger.log(`OpenAPI JSON at http://localhost:${port}/docs-json`);
}

bootstrap();
