import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Repository } from 'typeorm';
import { studyTypesServiceErrorMessages } from './study-types.constants';
import { StudyTypeEntity } from './study-type.entity';

@Injectable()
export class StudyTypesService extends BaseService<StudyTypeEntity> {
  constructor(
    @InjectRepository(StudyTypeEntity)
    private readonly genreEntityRepository: Repository<StudyTypeEntity>,
  ) {
    super(genreEntityRepository, studyTypesServiceErrorMessages);
  }
}
