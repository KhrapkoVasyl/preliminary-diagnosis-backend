import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { usersServiceErrorMessages } from './users.constants';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {
    super(userEntityRepository, usersServiceErrorMessages);
  }

  async selectUsersProfiles(
    options?: FindManyOptions<UserEntity>,
  ): Promise<UserEntity[]> {
    const users = await this.findAll(options);
    return users.map((user) => ({
      ...user,
      age: null,
      sexAtBirth: null,
    })) as UserEntity[];
  }

  async selectUserProfile(
    conditions: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.findOne(conditions);

    return { ...user, age: null, sexAtBirth: null } as UserEntity;
  }
}
