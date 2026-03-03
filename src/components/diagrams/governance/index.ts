/**
 * Governance Diagram Component Library
 * Phase 29: DIAG-01 through DIAG-06 + bonus ToolDeepDive
 *
 * Single-import barrel export for all 13 governance components.
 * Usage in MDX:
 *   import { AccessMatrix, RACIMatrix, RegulationRef } from '../components/diagrams/governance';
 */

// DIAG-01: Access control
export { AccessMatrix } from './AccessMatrixDiagrams';

// DIAG-02: Data classification
export { ClassificationTree } from './ClassificationTreeDiagrams';

// DIAG-03: Quality metrics
export { QualityGauge, QualityDashboard } from './QualityDiagrams';

// DIAG-04: Organizational structure
export { OrgChart } from './OrgChartDiagrams';

// DIAG-05: Maturity assessment
export { MaturityModel } from './MaturityModelDiagrams';

// DIAG-06: Document display
export { RACIMatrix, ComplianceChecklist, PolicyTemplate, DecisionMatrix } from './GovernanceDocsDiagrams';

// DIAG-06: Inline regulation reference
export { RegulationRef } from './RegulationRef';

// Bonus: Tool deep-dive wrapper (Phase 28-04 authoring guidelines)
export { ToolDeepDive } from './ToolDeepDive';

/* ------------------------------------------------------------------ */
/*  Type re-exports (for content author convenience)                   */
/* ------------------------------------------------------------------ */

// DIAG-01
export type { AccessMatrixProps, PermissionLevel } from './AccessMatrixDiagrams';

// DIAG-02
export type { ClassificationTreeProps, TreeNode } from './ClassificationTreeDiagrams';

// DIAG-06
export type {
  RACIMatrixProps,
  RACIValue,
  ComplianceChecklistProps,
  ChecklistItem,
  ComplianceStatus,
  PolicyTemplateProps,
  PolicySection,
  DecisionMatrixProps,
  Criterion,
  MatrixOption,
} from './GovernanceDocsDiagrams';

// Inline components
export type { RegulationRefProps } from './RegulationRef';
export type { ToolDeepDiveProps } from './ToolDeepDive';
