/* eslint-disable @typescript-eslint/naming-convention */
import { Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

export const loggerConfig = registerAs('logger', () => ({
  level: process.env.LOG_LEVEL ?? 'info',
  enableGlobalErrorLogging: process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true',
  logtailSourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
}));

export const LoggerConfig = () => Inject(loggerConfig.KEY);

export type LoggerConfig = ConfigType<typeof loggerConfig>;
