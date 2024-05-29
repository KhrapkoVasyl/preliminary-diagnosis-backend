import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';

export class CreatePatientDto extends PickType(CreateUserDto, [
  'age',
  'email',
  'name',
  'sexAtBirth',
]) {}
