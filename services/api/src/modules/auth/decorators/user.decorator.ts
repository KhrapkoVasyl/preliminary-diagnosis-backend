import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<UserEntity> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
