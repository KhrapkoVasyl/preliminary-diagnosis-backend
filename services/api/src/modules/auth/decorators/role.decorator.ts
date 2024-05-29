import { SetMetadata } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { UserRoleEnum } from 'src/modules/users/enums';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export const Role =
  (...roles: UserRoleEnum[]) =>
  (
    target: Record<string, any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    const operation: OperationObject = Reflect.getMetadata(
      DECORATORS.API_OPERATION,
      descriptor.value,
    );

    if (!operation)
      ApiOperation({ summary: `[ROLE: ${roles.join(', ')}]` })(
        target,
        key,
        descriptor,
      );
    else
      operation.summary = `[ROLE: ${roles.join(', ')}]${operation.summary && '; ' + operation.summary}`;

    SetMetadata('roles', roles)(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
  };
