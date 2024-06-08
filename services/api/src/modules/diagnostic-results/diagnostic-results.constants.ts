import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const diagnosticResultsServiceErrorMessages: TServiceErrorMessages = {
  entitiesNotFound: ErrorMessagesEnum.DIAGNOSTIC_RESULTS_NOT_FOUND,
  entityNotFound: ErrorMessagesEnum.DIAGNOSTIC_RESULT_NOT_FOUND,
  invalidData: ErrorMessagesEnum.INVALID_DATA,
};
