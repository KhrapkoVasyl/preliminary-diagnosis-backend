import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { diagnosticTypesServiceErrorMessages } from './diagnostic-types.constants';
import { DiagnosticTypeEntity } from './diagnostic-type.entity';

@Injectable()
export class DiagnosticTypesService extends BaseService<DiagnosticTypeEntity> {
  constructor(
    @InjectRepository(DiagnosticTypeEntity)
    private readonly diagnosticTypeEntityRepository: Repository<DiagnosticTypeEntity>,
  ) {
    super(diagnosticTypeEntityRepository, diagnosticTypesServiceErrorMessages);
  }
}
