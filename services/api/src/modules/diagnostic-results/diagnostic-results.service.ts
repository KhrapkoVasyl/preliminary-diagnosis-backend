import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticResultsServiceErrorMessages } from './diagnostic-results.constants';
import { DiagnosticResultEntity } from './diagnostic-result.entity';

@Injectable()
export class DiagnosticResultsService extends BaseService<DiagnosticResultEntity> {
  constructor(
    @InjectRepository(DiagnosticResultEntity)
    private readonly diagnosticResultEntityRepository: Repository<DiagnosticResultEntity>,
  ) {
    super(
      diagnosticResultEntityRepository,
      diagnosticResultsServiceErrorMessages,
    );
  }
}
