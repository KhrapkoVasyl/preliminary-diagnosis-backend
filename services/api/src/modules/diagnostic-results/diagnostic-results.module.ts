import { Module } from '@nestjs/common';
import { DiagnosticResultEntity } from './diagnostic-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticResultsService } from './diagnostic-results.service';
import { DiagnosticResultsController } from './diagnostic-results.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticResultEntity])],
  controllers: [DiagnosticResultsController],
  providers: [DiagnosticResultsService],
  exports: [DiagnosticResultsService],
})
export class DiagnosticResultsModule {}
