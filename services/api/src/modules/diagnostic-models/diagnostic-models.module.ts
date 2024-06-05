import { Module } from '@nestjs/common';
import { DiagnosticModelEntity } from './diagnostic-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticModelsService } from './diagnostic-models.service';
import { DiagnosticModelsController } from './diagnostic-models.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticModelEntity])],
  controllers: [DiagnosticModelsController],
  providers: [DiagnosticModelsService],
  exports: [DiagnosticModelsService],
})
export class DiagnosticModelsModule {}
