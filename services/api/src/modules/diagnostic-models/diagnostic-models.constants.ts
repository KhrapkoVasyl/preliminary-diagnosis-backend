import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const diagnosticModelsServiceErrorMessages: TServiceErrorMessages = {
  entitiesNotFound: ErrorMessagesEnum.DIAGNOSTIC_MODELS_NOT_FOUND,
  entityNotFound: ErrorMessagesEnum.DIAGNOSTIC_MODEL_NOT_FOUND,
  invalidData: ErrorMessagesEnum.INVALID_DATA,
};
