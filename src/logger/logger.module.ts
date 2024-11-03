import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { context, trace } from '@opentelemetry/api';
import { ClsService } from 'nestjs-cls';
import { LoggerModule as BaseLoggerModule } from 'nestjs-pino';
import type { LoggerConfig } from '../config/logger.config';
import { X_REQUEST_ID } from '../const';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    BaseLoggerModule.forRootAsync({
      inject: [ClsService, ConfigService],
      useFactory: (cls: ClsService, config: ConfigService) => {
        const { level, logtailSourceToken } =
          config.getOrThrow<LoggerConfig>('logger');

        return {
          pinoHttp: {
            name: 'crm',
            level: level,
            autoLogging: false,
            quietReqLogger: true,
            genReqId: (req, res) => {
              const existingID = req.id ?? req.headers[X_REQUEST_ID];
              if (existingID) {
                return existingID;
              }

              const id = cls.getId();
              res.setHeader(X_REQUEST_ID, id);
              return id;
            },
            transport:
              process.env.NODE_ENV !== 'production'
                ? { target: 'pino-pretty' }
                : {
                    target: '@logtail/pino',
                    options: { sourceToken: logtailSourceToken },
                  },
            formatters: {
              log(object) {
                const span = trace.getSpan(context.active());
                if (!span) return { ...object };
                const { traceId, spanId } = span.spanContext();
                return { ...object, spanId, traceId };
              },
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('/health')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
