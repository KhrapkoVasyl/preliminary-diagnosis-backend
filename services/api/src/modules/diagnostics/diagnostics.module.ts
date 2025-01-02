import { Module } from '@nestjs/common';
import { DiagnosticEntity } from './diagnostic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticsController } from './diagnostics.controller';
import { DiagnosticResultsModule } from '../diagnostic-results';
import { FilesModule } from '../files';
import { DiagnosticModelsModule } from '../diagnostic-models';
import { MessageQueueModule } from 'src/systems/message-queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagnosticEntity]),
    DiagnosticResultsModule,
    FilesModule,
    DiagnosticModelsModule,
    MessageQueueModule,
  ],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService],
  exports: [DiagnosticsService],
})
export class DiagnosticsModule {}
