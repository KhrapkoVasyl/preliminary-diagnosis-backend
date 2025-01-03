import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { FilesModule } from './modules/files';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth/auth.module';
import { DiagnosticTypesModule } from './modules/diagnostic-types';
import { DiagnosticModelsModule } from './modules/diagnostic-models';
import { DiagnosticModelVersionsModule } from './modules/diagnostic-model-versions';
import { DiagnosticsModule } from './modules/diagnostics';
import { DiagnosticResultsModule } from './modules/diagnostic-results';
import { MessageQueueModule } from './systems/message-queue';
import { DockerModule } from './systems/docker';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    DiagnosticTypesModule,
    DiagnosticModelsModule,
    DiagnosticModelVersionsModule,
    DiagnosticsModule,
    DiagnosticResultsModule,
    FilesModule,
    MessageQueueModule,
    DockerModule,
  ],
})
export class AppModule {}
