import { Module } from '@nestjs/common';
import { DiagnosticModelEntity } from './diagnostic-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticModelsService } from './diagnostic-models.service';
import { DiagnosticModelsController } from './diagnostic-models.controller';
import { FilesModule } from '../files';
import { DiagnosticModelVersionsModule } from '../diagnostic-model-versions';
import { DockerModule } from 'src/systems/docker';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiagnosticModelEntity]),
    FilesModule,
    DiagnosticModelVersionsModule,
    DockerModule,
  ],
  controllers: [DiagnosticModelsController],
  providers: [DiagnosticModelsService],
  exports: [DiagnosticModelsService],
})
export class DiagnosticModelsModule {}
