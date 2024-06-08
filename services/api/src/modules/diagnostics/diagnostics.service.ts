import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticsServiceErrorMessages } from './diagnostics.constants';
import { DiagnosticEntity } from './diagnostic.entity';

@Injectable()
export class DiagnosticsService extends BaseService<DiagnosticEntity> {
  constructor(
    @InjectRepository(DiagnosticEntity)
    private readonly diagnosticEntityRepository: Repository<DiagnosticEntity>,
  ) {
    super(diagnosticEntityRepository, diagnosticsServiceErrorMessages);
  }
}
