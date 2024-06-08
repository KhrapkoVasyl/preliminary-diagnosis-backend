import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const diagnosticsServiceErrorMessages: TServiceErrorMessages = {
  entitiesNotFound: ErrorMessagesEnum.DIAGNOSTICS_NOT_FOUND,
  entityNotFound: ErrorMessagesEnum.DIAGNOSTIC_NOT_FOUND,
  invalidData: ErrorMessagesEnum.INVALID_DATA,
};
