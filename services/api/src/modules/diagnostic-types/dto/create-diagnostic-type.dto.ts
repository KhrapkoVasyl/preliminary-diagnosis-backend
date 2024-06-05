import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDiagnosticTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    example: 'Melanoma',
    required: true,
    nullable: false,
    maxLength: 128,
  })
  public readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    example: 'Study of skin photography for the diagnosis of melanoma',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  public readonly description: string;
}
