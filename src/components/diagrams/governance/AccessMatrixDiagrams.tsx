/**
 * Access Matrix Diagrams (DIAG-01)
 *
 * Exports:
 * - AccessMatrix: Color-coded RBAC/ABAC permission grid accepting roles,
 *   resources, and permissions as props with optional tooltip support
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors, glassStyle } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export type PermissionLevel = 'allow' | 'deny' | 'conditional';

export interface AccessMatrixProps {
  /** Row labels (e.g., role names) */
  roles: string[];
  /** Column labels (e.g., resource names) */
  resources: string[];
  /** 2D array: permissions[roleIndex][resourceIndex] */
  permissions: PermissionLevel[][];
  /** Container title (defaults to RBAC matrix) */
  title?: string;
  /** Tooltip content keyed by "role:resource" */
  tooltips?: Record<string, string>;
}

/* ================================================================== */
/*  Permission Styles                                                  */
/* ================================================================== */

const permissionStyle: Record<PermissionLevel, {
  bg: string;
  border: string;
  text: string;
  label: string;
}> = {
  allow: {
    bg: `${colors.success}20`,
    border: `${colors.success}40`,
    text: colors.success,
    label: 'Allow',
  },
  deny: {
    bg: `${colors.danger}20`,
    border: `${colors.danger}40`,
    text: colors.danger,
    label: 'Deny',
  },
  conditional: {
    bg: `${colors.warning}20`,
    border: `${colors.warning}40`,
    text: colors.warning,
    label: 'Conditional',
  },
};

/* ================================================================== */
/*  AccessMatrix                                                       */
/* ================================================================== */

/**
 * AccessMatrix
 *
 * Renders a color-coded permission grid (RBAC/ABAC style).
 * Rows = roles, columns = resources, cells = allow/deny/conditional.
 * Wraps cells in DiagramTooltip when tooltips prop provides matching keys.
 */
export function AccessMatrix({
  roles,
  resources,
  permissions,
  title,
  tooltips,
}: AccessMatrixProps) {
  return (
    <DiagramContainer
      title={title || '\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 (RBAC)'}
      color="purple"
    >
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 4,
          }}
          role="grid"
          aria-label="Access control matrix"
        >
          {/* Column headers - resources */}
          <thead>
            <tr>
              <th style={{ padding: 6 }} />
              {resources.map((resource, ci) => (
                <th
                  key={ci}
                  style={{
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: colors.text,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {resource}
                </th>
              ))}
            </tr>
          </thead>

          {/* Row headers + cells */}
          <tbody>
            {roles.map((role, ri) => (
              <tr key={ri}>
                {/* Row header - role */}
                <td
                  style={{
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: colors.text,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {role}
                </td>

                {/* Permission cells */}
                {resources.map((resource, ci) => {
                  const level = permissions[ri]?.[ci] || 'deny';
                  const style = permissionStyle[level];
                  const tooltipKey = `${role}:${resource}`;
                  const hasTooltip = tooltips && tooltipKey in tooltips;

                  const cellContent = (
                    <div
                      tabIndex={hasTooltip ? 0 : undefined}
                      style={{
                        ...glassStyle,
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: style.text,
                        textAlign: 'center',
                        cursor: hasTooltip ? 'pointer' : 'default',
                        minWidth: 72,
                      }}
                    >
                      {style.label}
                    </div>
                  );

                  return (
                    <td key={ci} style={{ padding: 2 }}>
                      {hasTooltip ? (
                        <DiagramTooltip content={tooltips![tooltipKey]}>
                          {cellContent}
                        </DiagramTooltip>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DiagramContainer>
  );
}
