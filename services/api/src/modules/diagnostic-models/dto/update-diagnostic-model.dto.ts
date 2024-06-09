import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-diagnostic-model.dto';

export class UpdateGenreDto extends PartialType(
  OmitType(CreateGenreDto, ['type', 'queueName']),
) {}
