import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/modules/users/dto';

export class UpdateProfileDto extends PickType(UpdateUserDto, [
  'age',
  'sexAtBirth',
]) {}
