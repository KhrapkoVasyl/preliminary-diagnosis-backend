import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessagesEnum } from 'src/common/enums';
import { UserRoleEnum } from 'src/modules/users/enums';
import { UserEntity } from 'src/modules/users/user.entity';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public handleRequest(
    _err: Error,
    user: UserEntity,
    info: Error,
    ctx: ExecutionContext,
  ): UserEntity | any {
    if (info && !user)
      throw new UnauthorizedException(ErrorMessagesEnum.UNAUTHORIZED);

    const allowedRoles = this.reflector.get<UserRoleEnum[]>(
      'roles',
      ctx.getHandler(),
    );

    if (!allowedRoles || allowedRoles.includes(user.role)) return user;
    throw new ForbiddenException(ErrorMessagesEnum.FORBIDDEN);
  }
}
