import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateFileDto } from 'src/modules/files/dto';

export class UploadModelVersionDto extends CreateFileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @ApiProperty({
    example: 'Pytorch Custom model for Melanoma',
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
}
