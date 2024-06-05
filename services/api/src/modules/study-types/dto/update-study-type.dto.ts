import { PartialType } from '@nestjs/swagger';
import { CreateStudyTypeDto } from './create-study-type.dto';

export class UpdateStudyTypeDto extends PartialType(CreateStudyTypeDto) {}
