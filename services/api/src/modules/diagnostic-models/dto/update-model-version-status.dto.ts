import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DiagnosticModelVersionStatus } from 'src/modules/diagnostic-model-versions/enums';

export class UpdateModelVersionStatusDto {
  @IsEnum(DiagnosticModelVersionStatus)
  @ApiProperty({
    enum: DiagnosticModelVersionStatus,
    example: DiagnosticModelVersionStatus.DISABLED,
    examples: DiagnosticModelVersionStatus,
    nullable: false,
  })
  public readonly status: DiagnosticModelVersionStatus;
}
