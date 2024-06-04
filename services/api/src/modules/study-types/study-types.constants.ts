import { ErrorMessagesEnum } from 'src/common/enums';
import { TServiceErrorMessages } from 'src/common/types';

export const studyTypesServiceErrorMessages: TServiceErrorMessages = {
  entitiesNotFound: ErrorMessagesEnum.STUDY_TYPES_NOT_FOUND,
  entityNotFound: ErrorMessagesEnum.STUDY_TYPE_NOT_FOUND,
  invalidData: ErrorMessagesEnum.INVALID_DATA,
};
