import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticModelVersionsServiceErrorMessages } from './diagnostic-model-versions.constants';
import { DiagnosticModelVersionEntity } from './diagnostic-model-version.entity';

@Injectable()
export class DiagnosticModelVersionsService extends BaseService<DiagnosticModelVersionEntity> {
  constructor(
    @InjectRepository(DiagnosticModelVersionEntity)
    private readonly diagnosticModelVersionEntityRepository: Repository<DiagnosticModelVersionEntity>,
  ) {
    super(
      diagnosticModelVersionEntityRepository,
      diagnosticModelVersionsServiceErrorMessages,
    );
  }
}
