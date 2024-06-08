import { DiagnosticResultStatus } from '../diagnostic-results/enums';
import { DiagnosticStatus } from './enums';

export const getDiagnosticStatusQuery = (alias: string) => `
CASE
  WHEN (SELECT COUNT(*) FROM diagnostic-results dr WHERE dr.diagnosticId = ${alias}.id AND dr.status = '${DiagnosticResultStatus.FAILED}') > 0 THEN '${DiagnosticStatus.COMPLETED_WITH_ISSUES}'
  WHEN (SELECT COUNT(*) FROM diagnostic-results dr WHERE dr.diagnosticId = ${alias}.id AND dr.status != '${DiagnosticResultStatus.COMPLETED}') = 0 THEN '${DiagnosticStatus.COMPLETED}'
  ELSE '${DiagnosticStatus.PENDING}'
END
`;
