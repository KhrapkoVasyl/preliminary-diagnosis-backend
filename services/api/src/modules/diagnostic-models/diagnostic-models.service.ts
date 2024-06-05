import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticModelsServiceErrorMessages } from './diagnostic-models.constants';
import { DiagnosticModelEntity } from './diagnostic-model.entity';

@Injectable()
export class DiagnosticModelsService extends BaseService<DiagnosticModelEntity> {
  constructor(
    @InjectRepository(DiagnosticModelEntity)
    private readonly diagnosticModelEntityRepository: Repository<DiagnosticModelEntity>,
  ) {
    super(
      diagnosticModelEntityRepository,
      diagnosticModelsServiceErrorMessages,
    );
  }
}
