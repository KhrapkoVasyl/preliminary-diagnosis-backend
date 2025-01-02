import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';

export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {}
