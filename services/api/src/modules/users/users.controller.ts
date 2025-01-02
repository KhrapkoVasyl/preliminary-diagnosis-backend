import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { IdDto } from 'src/common/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards';
import { Role } from '../auth/decorators';
import { UserRoleEnum } from './enums';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role(UserRoleEnum.ADMIN)
  @Get('profiles')
  findAll(): Promise<UserEntity[]> {
    return this.usersService.selectUsersProfiles({
      where: { role: UserRoleEnum.PATIENT },
    });
  }

  @Role(UserRoleEnum.ADMIN)
  @Get('profile/:id')
  findOne(@Param() conditions: IdDto): Promise<UserEntity> {
    return this.usersService.selectUserProfile(conditions);
  }
}
