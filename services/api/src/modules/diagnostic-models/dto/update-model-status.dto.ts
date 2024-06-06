import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DiagnosticModelStatus } from '../enums';

export class UpdateModelStatusDto {
  @IsEnum(DiagnosticModelStatus)
  @ApiProperty({
    enum: DiagnosticModelStatus,
    example: DiagnosticModelStatus.DISABLED,
    examples: DiagnosticModelStatus,
    nullable: false,
  })
  public readonly status: DiagnosticModelStatus;
}
