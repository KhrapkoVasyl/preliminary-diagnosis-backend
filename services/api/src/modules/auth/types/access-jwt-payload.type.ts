import { UserRoleEnum } from 'src/modules/users/enums';

export type AccessJwtPayload = {
  id: string;
  role: UserRoleEnum;
  refreshTokenId: string;
};
