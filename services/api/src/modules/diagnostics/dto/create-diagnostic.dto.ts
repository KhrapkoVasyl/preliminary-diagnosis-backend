import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { CreateFileDto } from 'src/modules/files/dto';

export class CreateDiagnosticDto extends CreateFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    example: 'Diagnostic name',
    required: false,
    nullable: true,
    maxLength: 128,
  })
  public readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    required: false,
    nullable: true,
    maxLength: 500,
  })
  public readonly description: string;

  @Transform(({ value }) => value?.split(','))
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({ type: [String], required: true, nullable: false })
  public readonly modelIds?: string[];
}
