import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import isPortReachable from 'is-port-reachable';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

const host = 'localhost';

export async function setupAppMiddleware(
  app: INestApplication,
  configService: ConfigService,
) {
  // app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    }),
  );
  app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:3000'],
    credentials: true,
    maxAge: 86400,
  });
}

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.flushLogs();

  app.enableShutdownHooks();

  await setupAppMiddleware(app, configService);

  const port = await getAvailablePort(
    configService.get<string>('PORT') as string,
  );
  process.env.PORT = port.toString();

  await app.listen(port);

  const now = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  logger.log(`> NODE_ENV is ${process.env.NODE_ENV}`);
  logger.log(`> Ready on http://${host}:${port}`);
  logger.log(`> System Time Zone: ${timeZone}`);
  logger.log(`> Current System Time: ${now.toString()}`);

  process.on(
    'unhandledRejection',
    (reason: string, promise: Promise<unknown>) => {
      logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
      throw reason;
    },
  );

  process.on('uncaughtException', (error) => {
    logger.error(error);
  });
  return app;
}

async function getAvailablePort(dPort: number | string): Promise<number> {
  let port = Number(dPort);
  while (await isPortReachable(port, { host })) {
    console.log(`> Fail on http://${host}:${port} Trying on ${port + 1}`);
    port++;
  }
  return port;
}
