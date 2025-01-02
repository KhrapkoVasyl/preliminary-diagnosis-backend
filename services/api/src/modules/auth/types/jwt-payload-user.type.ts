import { UserRoleEnum } from 'src/modules/users/enums';

export type JwtPayloadUser = {
  id: string;
  role: UserRoleEnum;
  refreshTokenId: string;
};
