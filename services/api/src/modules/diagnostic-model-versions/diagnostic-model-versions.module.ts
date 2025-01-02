import { Module } from '@nestjs/common';
import { DiagnosticModelVersionEntity } from './diagnostic-model-version.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticModelVersionsService } from './diagnostic-model-versions.service';
import { DiagnosticModelVersionsController } from './diagnostic-model-versions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticModelVersionEntity])],
  controllers: [DiagnosticModelVersionsController],
  providers: [DiagnosticModelVersionsService],
  exports: [DiagnosticModelVersionsService],
})
export class DiagnosticModelVersionsModule {}
