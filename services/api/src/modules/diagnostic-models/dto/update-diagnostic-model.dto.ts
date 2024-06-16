import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDiagnosticModelDto } from './create-diagnostic-model.dto';

export class UpdateDiagnosticModelDto extends PartialType(
  OmitType(CreateDiagnosticModelDto, ['type', 'queueName']),
) {}
