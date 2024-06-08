import { Module } from '@nestjs/common';
import { DiagnosticEntity } from './diagnostic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticsService } from './diagnostics.service';
import { DiagnosticsController } from './diagnostics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticEntity])],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService],
  exports: [DiagnosticsService],
})
export class DiagnosticsModule {}
