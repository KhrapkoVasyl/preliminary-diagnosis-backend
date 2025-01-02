import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const diagnosticTypesServiceErrorMessages: TServiceErrorMessages = {
  entitiesNotFound: ErrorMessagesEnum.DIAGNOSTIC_TYPES_NOT_FOUND,
  entityNotFound: ErrorMessagesEnum.DIAGNOSTIC_TYPE_NOT_FOUND,
  invalidData: ErrorMessagesEnum.INVALID_DATA,
};
