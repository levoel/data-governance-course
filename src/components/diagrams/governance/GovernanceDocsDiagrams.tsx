/**
 * Governance Document Display Diagrams (DIAG-06)
 *
 * Exports:
 * - RACIMatrix: Color-coded RACI responsibility assignment matrix
 * - ComplianceChecklist: Ordered compliance items with status badges
 * - PolicyTemplate: Structured policy document with titled sections and metadata
 * - DecisionMatrix: Weighted scoring table computing total scores per option
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors, glassStyle } from '@primitives/shared';

/* ================================================================== */
/*  RACIMatrix                                                         */
/* ================================================================== */

export type RACIValue = 'R' | 'A' | 'C' | 'I' | '';

export interface RACIMatrixProps {
  /** Row labels (activities/tasks) */
  activities: string[];
  /** Column labels (roles) */
  roles: string[];
  /** 2D array: assignments[activityIndex][roleIndex] */
  assignments: RACIValue[][];
  /** Container title */
  title?: string;
}

const raciStyle: Record<string, {
  bg: string;
  border: string;
  text: string;
}> = {
  R: {
    bg: `${colors.info}20`,
    border: `${colors.info}40`,
    text: colors.info,
  },
  A: {
    bg: `${colors.danger}20`,
    border: `${colors.danger}40`,
    text: colors.danger,
  },
  C: {
    bg: `${colors.warning}20`,
    border: `${colors.warning}40`,
    text: colors.warning,
  },
  I: {
    bg: `${colors.success}20`,
    border: `${colors.success}40`,
    text: colors.success,
  },
};

/**
 * RACIMatrix
 *
 * Renders a color-coded RACI responsibility assignment matrix.
 * Rows = activities, columns = roles, cells = R/A/C/I values with
 * distinct color coding per responsibility type.
 */
export function RACIMatrix({
  activities,
  roles,
  assignments,
  title,
}: RACIMatrixProps) {
  return (
    <DiagramContainer
      title={title || '\u0420\u0410\u0421\u0418-\u043C\u0430\u0442\u0440\u0438\u0446\u0430'}
      color="blue"
    >
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 4,
          }}
          role="grid"
          aria-label="RACI responsibility matrix"
        >
          {/* Column headers - roles */}
          <thead>
            <tr>
              <th style={{ padding: 6 }} />
              {roles.map((role, ci) => (
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
                  {role}
                </th>
              ))}
            </tr>
          </thead>

          {/* Row headers + cells */}
          <tbody>
            {activities.map((activity, ri) => (
              <tr key={ri}>
                {/* Row header - activity */}
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
                  {activity}
                </td>

                {/* RACI cells */}
                {roles.map((_role, ci) => {
                  const value = assignments[ri]?.[ci] || '';
                  const style = value ? raciStyle[value] : null;

                  return (
                    <td key={ci} style={{ padding: 2 }}>
                      <div
                        style={{
                          ...glassStyle,
                          background: style ? style.bg : 'transparent',
                          border: style
                            ? `1px solid ${style.border}`
                            : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          color: style ? style.text : colors.textMuted,
                          textAlign: 'center',
                          minWidth: 40,
                        }}
                      >
                        {value || '\u2014'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 12,
          justifyContent: 'center',
        }}
      >
        {[
          { letter: 'R', label: 'Responsible', color: colors.info },
          { letter: 'A', label: 'Accountable', color: colors.danger },
          { letter: 'C', label: 'Consulted', color: colors.warning },
          { letter: 'I', label: 'Informed', color: colors.success },
        ].map((item) => (
          <div
            key={item.letter}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              fontFamily: 'monospace',
              color: colors.textMuted,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 18,
                height: 18,
                lineHeight: '18px',
                textAlign: 'center',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                color: item.color,
                background: `${item.color}20`,
                border: `1px solid ${item.color}40`,
              }}
            >
              {item.letter}
            </span>
            {item.label}
          </div>
        ))}
      </div>
    </DiagramContainer>
  );
}

/* ================================================================== */
/*  ComplianceChecklist                                                 */
/* ================================================================== */

export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';

export interface ChecklistItem {
  /** Requirement description */
  requirement: string;
  /** Compliance status */
  status: ComplianceStatus;
  /** Optional note (shown in tooltip and as subtext) */
  note?: string;
}

export interface ComplianceChecklistProps {
  /** List of compliance check items */
  items: ChecklistItem[];
  /** Container title */
  title?: string;
}

const statusConfig: Record<ComplianceStatus, {
  color: string;
  symbol: string;
  label: string;
}> = {
  compliant: {
    color: colors.success,
    symbol: '\u2713',
    label: '\u0421\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442',
  },
  'non-compliant': {
    color: colors.danger,
    symbol: '\u2717',
    label: '\u041D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442',
  },
  partial: {
    color: colors.warning,
    symbol: '\u007E',
    label: '\u0427\u0430\u0441\u0442\u0438\u0447\u043D\u043E',
  },
  'not-applicable': {
    color: colors.textMuted,
    symbol: '\u2014',
    label: '\u041D\u0435\u043F\u0440\u0438\u043C\u0435\u043D\u0438\u043C\u043E',
  },
};

/**
 * ComplianceChecklist
 *
 * Renders an ordered list of compliance requirements with color-coded
 * status badges. Items with notes show a tooltip on hover/click.
 */
export function ComplianceChecklist({
  items,
  title,
}: ComplianceChecklistProps) {
  return (
    <DiagramContainer
      title={title || '\u0427\u0435\u043A-\u043B\u0438\u0441\u0442 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u044F'}
      color="emerald"
    >
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {items.map((item, i) => {
          const config = statusConfig[item.status];

          const row = (
            <li
              key={i}
              tabIndex={item.note ? 0 : undefined}
              style={{
                ...glassStyle,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 14px',
                cursor: item.note ? 'pointer' : 'default',
              }}
            >
              {/* Left side: index + requirement */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: colors.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: colors.text,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.requirement}
                  </span>
                </div>
                {item.note && (
                  <div
                    style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginTop: 4,
                      paddingLeft: 28,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.note}
                  </div>
                )}
              </div>

              {/* Right side: status badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}30`,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: config.color,
                  }}
                >
                  {config.symbol}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: config.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {config.label}
                </span>
              </div>
            </li>
          );

          if (item.note) {
            return (
              <DiagramTooltip key={i} content={item.note}>
                {row}
              </DiagramTooltip>
            );
          }

          return row;
        })}
      </ol>
    </DiagramContainer>
  );
}

/* ================================================================== */
/*  PolicyTemplate                                                     */
/* ================================================================== */

export interface PolicySection {
  /** Section heading */
  heading: string;
  /** Section content text */
  content: string;
}

export interface PolicyTemplateProps {
  /** Ordered list of policy sections */
  sections: PolicySection[];
  /** Container title */
  title?: string;
  /** Optional key-value metadata (e.g., Version, Owner, Status) */
  metadata?: Record<string, string>;
}

/**
 * PolicyTemplate
 *
 * Renders a structured policy document with titled sections and optional
 * metadata bar. Used to display governance policy templates and frameworks.
 */
export function PolicyTemplate({
  sections,
  title,
  metadata,
}: PolicyTemplateProps) {
  return (
    <DiagramContainer
      title={title || '\u0428\u0430\u0431\u043B\u043E\u043D \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0438'}
      color="purple"
    >
      {/* Metadata bar */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            padding: '8px 12px',
            marginBottom: 16,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {Object.entries(metadata).map(([key, value]) => (
            <span
              key={key}
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: colors.textMuted,
              }}
            >
              <span style={{ fontWeight: 600 }}>{key}:</span>{' '}
              <span style={{ color: colors.text }}>{value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Sections */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {sections.map((section, i) => (
          <div key={i}>
            {/* Separator between sections */}
            {i > 0 && (
              <div
                style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.1)',
                  margin: '12px 0',
                }}
              />
            )}

            {/* Heading with left accent border */}
            <div
              style={{
                borderLeft: `2px solid ${colors.accent}66`,
                paddingLeft: 12,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.accent,
                  fontFamily: 'monospace',
                }}
              >
                {section.heading}
              </span>
            </div>

            {/* Content */}
            <div
              style={{
                fontSize: 13,
                color: colors.text,
                lineHeight: 1.6,
                paddingLeft: 14,
              }}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </DiagramContainer>
  );
}

/* ================================================================== */
/*  DecisionMatrix                                                     */
/* ================================================================== */

export interface Criterion {
  /** Criterion name */
  name: string;
  /** Weight (0-1), used to compute weighted totals */
  weight: number;
}

export interface MatrixOption {
  /** Option name */
  name: string;
  /** Scores array: one score per criterion, typically 1-5 */
  scores: number[];
}

export interface DecisionMatrixProps {
  /** Evaluation criteria with weights */
  criteria: Criterion[];
  /** Options to evaluate */
  options: MatrixOption[];
  /** Container title */
  title?: string;
}

/**
 * DecisionMatrix
 *
 * Renders a weighted scoring table that computes total scores per option.
 * Cells are intensity-colored by score value. The winning option (highest
 * weighted total) gets a highlight border.
 */
export function DecisionMatrix({
  criteria,
  options,
  title,
}: DecisionMatrixProps) {
  // Determine max possible score for intensity scaling
  const maxScore = Math.max(
    ...options.flatMap((o) => o.scores),
    1,
  );

  // Compute weighted totals
  const totals = options.map((option) =>
    criteria.reduce((sum, criterion, ci) => {
      const score = option.scores[ci] ?? 0;
      return sum + score * criterion.weight;
    }, 0),
  );

  const maxTotal = Math.max(...totals, 0.01);
  const winnerIndex = totals.indexOf(Math.max(...totals));

  return (
    <DiagramContainer
      title={title || '\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u043F\u0440\u0438\u043D\u044F\u0442\u0438\u044F \u0440\u0435\u0448\u0435\u043D\u0438\u0439'}
      color="amber"
    >
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 4,
          }}
          role="grid"
          aria-label="Decision scoring matrix"
        >
          {/* Column headers - criteria + total */}
          <thead>
            <tr>
              <th style={{ padding: 6 }} />
              {criteria.map((criterion, ci) => (
                <th
                  key={ci}
                  style={{
                    padding: '6px 8px',
                    textAlign: 'center',
                    verticalAlign: 'bottom',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: colors.text,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {criterion.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    ({(criterion.weight * 100).toFixed(0)}%)
                  </div>
                </th>
              ))}
              <th
                style={{
                  padding: '6px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: colors.text,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {'\u0418\u0442\u043E\u0433\u043E'}
              </th>
            </tr>
          </thead>

          {/* Rows - options */}
          <tbody>
            {options.map((option, ri) => {
              const isWinner = ri === winnerIndex;
              const total = totals[ri];

              return (
                <tr key={ri}>
                  {/* Row header - option name */}
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
                    {option.name}
                  </td>

                  {/* Score cells */}
                  {criteria.map((_criterion, ci) => {
                    const score = option.scores[ci] ?? 0;
                    const intensity = score / maxScore;

                    return (
                      <td key={ci} style={{ padding: 2 }}>
                        <div
                          style={{
                            ...glassStyle,
                            background: `${colors.primary}${Math.round(intensity * 40).toString(16).padStart(2, '0')}`,
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            color: colors.text,
                            textAlign: 'center',
                            minWidth: 40,
                          }}
                        >
                          {score}
                        </div>
                      </td>
                    );
                  })}

                  {/* Total cell */}
                  <td style={{ padding: 2 }}>
                    <div
                      style={{
                        ...glassStyle,
                        background: isWinner
                          ? `${colors.success}25`
                          : 'rgba(255,255,255,0.03)',
                        border: isWinner
                          ? `2px solid ${colors.success}60`
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: isWinner ? colors.success : colors.text,
                        textAlign: 'center',
                        minWidth: 50,
                      }}
                    >
                      {total.toFixed(1)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DiagramContainer>
  );
}
