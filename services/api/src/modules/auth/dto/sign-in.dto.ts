import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class SingInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(256)
  @ApiProperty({
    example: 'password1234',
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
}
