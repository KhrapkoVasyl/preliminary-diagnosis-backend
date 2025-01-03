import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IdDto } from 'src/common/dto';

export class CreateDiagnosticModelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    example: 'Tensorflow Custom model for Melanoma',
    required: true,
    nullable: false,
    maxLength: 128,
  })
  public readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    example: 'Model description example',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  public readonly description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    example: 'MELANOMA_CUSTOM_MODEL_QUEUE',
    required: true,
    nullable: false,
    maxLength: 128,
  })
  public readonly queueName: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @ApiProperty({ type: IdDto, required: true, nullable: false })
  public readonly type: IdDto;
}
