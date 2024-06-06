import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDiagnosticModelVersionDto } from './create-diagnostic-model-version.dto';

export class UpdateDiagnosticModelVersionDto extends PartialType(
  OmitType(CreateDiagnosticModelVersionDto, ['model']),
) {}
