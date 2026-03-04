/**
 * Quality Diagrams (DIAG-03)
 *
 * Exports:
 * - QualityGauge: SVG semicircle arc gauge with score, color thresholds, and label
 * - QualityDashboard: Responsive grid of QualityGauge components with summary
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors } from '@primitives/shared';

/* ================================================================== */
/*  QualityGauge                                                       */
/* ================================================================== */

interface QualityGaugeProps {
  score: number;
  label: string;
  thresholds?: { red: number; yellow: number };
}

/**
 * QualityGauge
 *
 * SVG 180-degree arc gauge showing a quality score (0-100).
 * Color transitions: red (< red threshold) -> yellow (< yellow threshold) -> green (>= yellow).
 */
export function QualityGauge({
  score,
  label,
  thresholds = { red: 60, yellow: 80 },
}: QualityGaugeProps) {
  // Auto-detect 0-1 range and normalize to 0-100
  const normalized = score > 0 && score <= 1 ? Math.round(score * 100) : score;
  const clampedScore = Math.max(0, Math.min(100, normalized));

  const radius = 60;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (clampedScore / 100) * circumference;

  const arcColor =
    clampedScore < thresholds.red
      ? colors.danger
      : clampedScore < thresholds.yellow
        ? colors.warning
        : colors.success;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg
        viewBox="0 0 160 100"
        width="100%"
        style={{ maxWidth: 160, overflow: 'visible' }}
        role="img"
        aria-label={`${label}: ${clampedScore}%`}
      >
        {/* Background arc */}
        <path
          d="M 20 90 A 60 60 0 0 1 140 90"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 20 90 A 60 60 0 0 1 140 90"
          fill="none"
          stroke={arcColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
        {/* Score text */}
        <text
          x={80}
          y={78}
          textAnchor="middle"
          fill={arcColor}
          fontSize={24}
          fontWeight={700}
          fontFamily="monospace"
        >
          {clampedScore}
        </text>
        {/* Label text */}
        <text
          x={80}
          y={95}
          textAnchor="middle"
          fill={colors.textMuted}
          fontSize={10}
          fontFamily="monospace"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  QualityDashboard                                                   */
/* ================================================================== */

interface QualityDimension {
  name: string;
  score: number;
  tooltip?: string;
}

interface QualityDashboardProps {
  dimensions: QualityDimension[];
  title?: string;
  thresholds?: { red: number; yellow: number };
}

/**
 * QualityDashboard
 *
 * Responsive grid of QualityGauge components with an overall average summary.
 * Wraps in DiagramContainer with emerald color theme.
 */
export function QualityDashboard({
  dimensions,
  title,
  thresholds,
}: QualityDashboardProps) {
  const averageScore =
    dimensions.length > 0
      ? Math.round(
          dimensions.reduce((sum, d) => {
            const norm = d.score > 0 && d.score <= 1 ? Math.round(d.score * 100) : d.score;
            return sum + Math.max(0, Math.min(100, norm));
          }, 0) /
            dimensions.length
        )
      : 0;

  const avgColor =
    averageScore < (thresholds?.red ?? 60)
      ? colors.danger
      : averageScore < (thresholds?.yellow ?? 80)
        ? colors.warning
        : colors.success;

  return (
    <DiagramContainer
      title={title || 'Dashboard качества данных'}
      color="emerald"
    >
      {/* Gauge grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {dimensions.map((dim, i) => {
          const gauge = (
            <QualityGauge
              key={i}
              score={dim.score}
              label={dim.name}
              thresholds={thresholds}
            />
          );

          if (dim.tooltip) {
            return (
              <DiagramTooltip key={i} content={dim.tooltip}>
                <div tabIndex={0}>{gauge}</div>
              </DiagramTooltip>
            );
          }

          return <div key={i}>{gauge}</div>;
        })}
      </div>

      {/* Summary row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 16px',
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
          Средний балл:
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: avgColor,
            fontFamily: 'monospace',
          }}
        >
          {averageScore}
        </span>
        <span
          style={{
            fontSize: 12,
            color: colors.textMuted,
            fontFamily: 'monospace',
          }}
        >
          / 100
        </span>
      </div>
    </DiagramContainer>
  );
}
