import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SexAtBirthEnum } from '../enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @ApiProperty({
    example: 'John Nicols',
    required: true,
    nullable: false,
    minLength: 1,
    maxLength: 128,
  })
  public readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(256)
  @ApiProperty({
    example: 'Pass1234',
    required: true,
    nullable: false,
    minLength: 6,
    maxLength: 256,
  })
  public readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(256)
  @ApiProperty({
    example: 'example@mail.com',
    required: true,
    nullable: false,
    maxLength: 256,
  })
  public readonly email: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  @ApiProperty({
    required: false,
    nullable: true,
    maximum: 120,
    minimum: 1,
  })
  public readonly age?: number;

  @IsOptional()
  @IsEnum(SexAtBirthEnum)
  @ApiProperty({
    enum: SexAtBirthEnum,
    examples: SexAtBirthEnum,
    nullable: true,
  })
  public readonly sexAtBirth?: SexAtBirthEnum;
}
