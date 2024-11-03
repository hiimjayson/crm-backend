import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { LoggerModule } from './logger/logger.module';
import deepmerge from 'deepmerge';
import { GlobalModule } from './global/global.module';

const featureModules = [AuthModule, UserModule];

const appModuleMetadata = {
  imports: [LoggerModule, ...featureModules],
  controllers: [AppController],
  providers: [AppService],
};

@Module(
  deepmerge(
    {
      imports: [GlobalModule],
    },
    appModuleMetadata,
  ),
)
export class AppModule {}
