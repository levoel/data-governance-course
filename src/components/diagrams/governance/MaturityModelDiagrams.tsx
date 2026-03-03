/**
 * MaturityModel Diagrams (DIAG-05)
 *
 * Exports:
 * - MaturityModel: Horizontal segmented bar with labeled maturity levels and current-level indicator
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface MaturityLevel {
  name: string;
  description: string;
}

interface MaturityModelProps {
  currentLevel: number;
  levels?: MaturityLevel[];
  title?: string;
}

/* ================================================================== */
/*  Defaults                                                           */
/* ================================================================== */

const DEFAULT_LEVELS: MaturityLevel[] = [
  { name: 'Initial', description: 'Ad-hoc, reactive' },
  { name: 'Managed', description: 'Repeatable, documented' },
  { name: 'Defined', description: 'Standardized, proactive' },
  { name: 'Quantitatively Managed', description: 'Measured, controlled' },
  { name: 'Optimizing', description: 'Continuous improvement' },
];

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

/**
 * Returns a color for the given level index (0-based).
 * Gradient from danger (level 0) through warning (1-2) to success (3-4).
 */
function getSegmentColor(index: number, total: number): string {
  if (total <= 1) return colors.success;
  const ratio = index / (total - 1);
  if (ratio <= 0.25) return colors.danger;
  if (ratio <= 0.5) return colors.warning;
  if (ratio <= 0.75) return '#22d3ee'; // cyan-400 for transition
  return colors.success;
}

/* ================================================================== */
/*  MaturityModel                                                      */
/* ================================================================== */

/**
 * MaturityModel
 *
 * Renders a horizontal segmented progression bar with N labeled levels.
 * The current level and all below it are shown at full opacity; levels above
 * current are dimmed. Each segment has a tooltip with its description.
 * Responsive via flex layout.
 */
export function MaturityModel({
  currentLevel,
  levels = DEFAULT_LEVELS,
  title,
}: MaturityModelProps) {
  const clampedLevel = Math.max(1, Math.min(levels.length, currentLevel));
  const activeIndex = clampedLevel - 1; // 0-based

  return (
    <DiagramContainer
      title={title || 'Модель зрелости Data Governance'}
      color="amber"
    >
      {/* Segmented bar */}
      <div
        style={{
          display: 'flex',
          gap: 3,
          marginBottom: 12,
        }}
      >
        {levels.map((level, i) => {
          const isActive = i === activeIndex;
          const isCompleted = i <= activeIndex;
          const segmentColor = getSegmentColor(i, levels.length);

          return (
            <DiagramTooltip key={i} content={`${level.name}: ${level.description}`}>
              <div
                tabIndex={0}
                style={{
                  flex: 1,
                  position: 'relative',
                  padding: '12px 6px 8px',
                  background: segmentColor,
                  opacity: isCompleted ? 1 : 0.2,
                  borderRadius: i === 0 ? '8px 0 0 8px' : i === levels.length - 1 ? '0 8px 8px 0' : 0,
                  border: isActive ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  transform: isActive ? 'scaleY(1.08)' : 'scaleY(1)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  cursor: 'default',
                  zIndex: isActive ? 1 : 0,
                }}
                aria-label={`Level ${i + 1}: ${level.name}${isActive ? ' (current)' : ''}`}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#fff',
                    fontFamily: 'monospace',
                    lineHeight: 1.2,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {level.name}
                </div>

                {/* Current level marker arrow */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: `6px solid ${colors.text}`,
                    }}
                  />
                )}
              </div>
            </DiagramTooltip>
          );
        })}
      </div>

      {/* Current level description */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 14,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: colors.textMuted,
            fontFamily: 'monospace',
          }}
        >
          Текущий уровень:{' '}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.text,
            fontFamily: 'monospace',
          }}
        >
          {levels[activeIndex].name}
        </span>
        <span
          style={{
            fontSize: 12,
            color: colors.textMuted,
            fontFamily: 'monospace',
          }}
        >
          {' '}&mdash; {levels[activeIndex].description}
        </span>
      </div>
    </DiagramContainer>
  );
}
