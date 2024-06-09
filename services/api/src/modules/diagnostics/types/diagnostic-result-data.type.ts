import { DiagnosticResultStatus } from 'src/modules/diagnostic-results/enums';

export type DiagnosticResultData = {
  resultId: string;
  status: DiagnosticResultStatus;
  diseaseProbability: number;
  description?: string;
};
