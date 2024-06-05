import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { FilesModule } from './modules/files';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth/auth.module';
import { DiagnosticTypesModule } from './modules/diagnostic-types';
import { DiagnosticModelsModule } from './modules/diagnostic-models';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    DiagnosticTypesModule,
    DiagnosticModelsModule,
    FilesModule,
  ],
})
export class AppModule {}
