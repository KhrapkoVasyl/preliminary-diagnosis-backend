import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { RefreshJwtPayload } from '../types';
import { UsersService } from 'src/modules/users/users.service';
import { RefreshTokensService } from 'src/modules/refresh-tokens/refresh-tokens.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: appConfigService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate({ id, role, refreshTokenId }: RefreshJwtPayload) {
    const userData = await this.usersService.findOne(
      { id, role },
      {
        loadEagerRelations: false,
      },
    );
    const tokenData = await this.refreshTokensService.findOne(
      {
        id: refreshTokenId,
        user: { id: userData.id },
      },
      {
        select: { id: true },
        loadEagerRelations: false,
      },
    );

    return { ...userData, refreshTokenId: tokenData.id };
  }
}
