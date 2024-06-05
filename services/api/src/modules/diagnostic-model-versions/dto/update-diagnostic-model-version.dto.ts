import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-diagnostic-model-version.dto';

export class UpdateGenreDto extends PartialType(
  OmitType(CreateGenreDto, ['model']),
) {}
