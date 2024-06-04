import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { refreshTokensServiceErrorMessages } from './refresh-tokens.constants';
import { BaseService } from 'src/common/services';
import * as ms from 'ms';
import { AppConfigService } from 'src/config/app-config.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { USER_MAX_SESSIONS } from '../auth/auth.constants';

@Injectable()
export class RefreshTokensService extends BaseService<RefreshTokenEntity> {
  tokenExpirationTime = this.appConfigService.get<string>(
    'JWT_REFRESH_EXPIRATION_TIME',
  );

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenEntityRepository: Repository<RefreshTokenEntity>,
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
  ) {
    super(refreshTokenEntityRepository, refreshTokensServiceErrorMessages);
  }

  async createToken(
    condition: FindOptionsWhere<UserEntity>,
    data: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    const user = await this.usersService.findOne(condition);

    const tokenDuration = ms(this.tokenExpirationTime);
    const currentDateTime = new Date();
    const expiresAt = new Date(currentDateTime.getTime() + tokenDuration);

    const refreshTokenModel: Partial<RefreshTokenEntity> = {
      ...data,
      user,
      expiresAt,
    };

    return this.createOne(refreshTokenModel);
  }

  async deleteExpiredTokens(condition: FindOptionsWhere<RefreshTokenEntity>) {
    const expiredTokens = await this.refreshTokenEntityRepository.find({
      where: condition,
      order: { createdAt: 'DESC' },
      skip: USER_MAX_SESSIONS,
    });

    const tokenToDeleteIds = expiredTokens.map(({ id }) => id);
    if (tokenToDeleteIds.length) {
      await this.refreshTokenEntityRepository.delete(tokenToDeleteIds);
    }
  }
}
