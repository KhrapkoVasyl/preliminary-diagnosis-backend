import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const diagnosticModelVersionsServiceErrorMessages: TServiceErrorMessages =
  {
    entitiesNotFound: ErrorMessagesEnum.DIAGNOSTIC_MODELS_VERSIONS_NOT_FOUND,
    entityNotFound: ErrorMessagesEnum.DIAGNOSTIC_MODEL_VERSION_NOT_FOUND,
    invalidData: ErrorMessagesEnum.INVALID_DATA,
  };
