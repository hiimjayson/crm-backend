import { Logger, Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { loggerConfig } from './logger.config';

const configurations = [loggerConfig];

@Module({})
export class ConfigModule {
  static register() {
    return BaseConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: configurations,
      envFilePath: ['.env', '.env.local', '.env.development'].map((envDir) => {
        Logger.attachBuffer();
        Logger.log(`[Env File Path]: ${envDir}`);
        Logger.detachBuffer();
        return envDir;
      }),
    });
  }
}
