/**
 * ToolDeepDive - Tool-specific content wrapper (bonus component)
 *
 * Referenced in Phase 28-04 content-authoring-guidelines.md Section 7.
 * Replaces placeholder :::tool-deep-dive callout syntax.
 *
 * Exports:
 * - ToolDeepDive: Callout wrapper with tool name, version, and lastVerified metadata
 */

import { colors, glassStyle } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface ToolDeepDiveProps {
  /** Tool name (e.g., "OpenMetadata") */
  tool: string;
  /** Version string (e.g., "1.3.x") */
  version: string;
  /** Last verified date in YYYY-MM format (e.g., "2026-03") */
  lastVerified: string;
  /** Tool-specific content (MDX children) */
  children: React.ReactNode;
}

/* ================================================================== */
/*  ToolDeepDive                                                       */
/* ================================================================== */

/**
 * ToolDeepDive
 *
 * Block-level callout wrapper that isolates tool-specific content.
 * Renders a glass-styled box with tool name, version badge, and
 * last-verified date. Children contain the tool-specific MDX content.
 */
export function ToolDeepDive({
  tool,
  version,
  lastVerified,
  children,
}: ToolDeepDiveProps) {
  return (
    <div
      style={{
        ...glassStyle,
        borderLeft: `3px solid ${colors.warning}66`,
        padding: 0,
        marginBottom: 16,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          padding: '8px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Tool name pill */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'monospace',
            color: colors.warning,
            background: `${colors.warning}20`,
            border: `1px solid ${colors.warning}40`,
            borderRadius: 4,
            padding: '2px 8px',
          }}
        >
          {tool}
        </span>

        {/* Version pill */}
        <span
          style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: colors.textMuted,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          v{version}
        </span>

        {/* Spacer */}
        <span style={{ flex: 1 }} />

        {/* Last verified */}
        <span
          style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: colors.textMuted,
          }}
        >
          {lastVerified}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px' }}>
        {children}
      </div>
    </div>
  );
}
