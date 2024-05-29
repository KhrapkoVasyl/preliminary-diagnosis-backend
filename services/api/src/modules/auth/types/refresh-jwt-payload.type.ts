import { UserRoleEnum } from 'src/modules/users/enums';

export type RefreshJwtPayload = {
  id: string;
  role: UserRoleEnum;
  refreshTokenId: string;
};
