import { Module } from '@nestjs/common';
import { DiagnosticResultEntity } from './diagnostic-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticResultsService } from './diagnostic-results.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticResultEntity])],
  providers: [DiagnosticResultsService],
  exports: [DiagnosticResultsService],
})
export class DiagnosticResultsModule {}
