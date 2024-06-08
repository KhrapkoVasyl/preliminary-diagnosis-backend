import { DiagnosticStatus } from './enums';

export const getDiagnosticStatusQuery = (alias: string) => `
CASE
  WHEN (SELECT COUNT(*) FROM diagnostic_results dr WHERE dr.diagnosticId = ${alias}.id AND dr.status = 'FAILED') > 0 THEN '${DiagnosticStatus.COMPLETED_WITH_ISSUES}'
  WHEN (SELECT COUNT(*) FROM diagnostic_results dr WHERE dr.diagnosticId = ${alias}.id AND dr.status != 'COMPLETED') = 0 THEN '${DiagnosticStatus.COMPLETED}'
  ELSE '${DiagnosticStatus.PENDING}'
END
`;
