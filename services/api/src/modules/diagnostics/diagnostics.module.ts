import { Module } from '@nestjs/common';
import { DiagnosticEntity } from './diagnostic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticsController } from './diagnostics.controller';
import { DiagnosticResultsModule } from '../diagnostic-results';
import { FilesModule } from '../files';
import { DiagnosticModelsModule } from '../diagnostic-models';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagnosticEntity]),
    DiagnosticResultsModule,
    FilesModule,
    DiagnosticModelsModule,
  ],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService],
  exports: [DiagnosticsService],
})
export class DiagnosticsModule {}
