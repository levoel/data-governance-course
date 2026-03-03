/**
 * Classification Tree Diagrams (DIAG-02)
 *
 * Exports:
 * - ClassificationTree: Recursive taxonomy/hierarchy renderer with
 *   CSS connector lines, glass-styled nodes, and optional tooltips
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors, glassStyle } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface TreeNode {
  /** Primary label text */
  label: string;
  /** Level/category badge (e.g., "L1", "Public", "Restricted") */
  level: string;
  /** Accent color for left border (hex, defaults to primary) */
  color?: string;
  /** Nested children */
  children?: TreeNode[];
  /** Tooltip content shown on click/hover */
  tooltip?: string;
}

export interface ClassificationTreeProps {
  /** Root-level tree nodes */
  tree: TreeNode[];
  /** Container title (defaults to data classification) */
  title?: string;
}

/* ================================================================== */
/*  Connector styles                                                   */
/* ================================================================== */

const connectorColor = 'rgba(255, 255, 255, 0.15)';
const connectorWidth = 2;
const indentSize = 24;
const horizontalDash = 16;

/* ================================================================== */
/*  TreeNodeComponent (private)                                        */
/* ================================================================== */

interface TreeNodeComponentProps {
  node: TreeNode;
  isLast: boolean;
  depth: number;
}

function TreeNodeComponent({ node, isLast, depth }: TreeNodeComponentProps) {
  const accentColor = node.color || colors.primary;
  const hasChildren = node.children && node.children.length > 0;

  const nodeBox = (
    <div
      tabIndex={node.tooltip ? 0 : undefined}
      style={{
        ...glassStyle,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: '8px',
        padding: '8px 14px',
        cursor: node.tooltip ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: '100%',
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'monospace',
          color: colors.text,
        }}
      >
        {node.label}
      </span>

      {/* Level badge */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          fontFamily: 'monospace',
          color: accentColor,
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}40`,
          borderRadius: 4,
          padding: '2px 6px',
          whiteSpace: 'nowrap',
        }}
      >
        {node.level}
      </span>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Connector: vertical line from parent + horizontal dash */}
      {depth > 0 && (
        <div
          style={{
            position: 'absolute',
            left: -(indentSize - horizontalDash / 2),
            top: 0,
            bottom: isLast ? '50%' : 0,
            width: connectorWidth,
            background: connectorColor,
          }}
          aria-hidden="true"
        />
      )}
      {depth > 0 && (
        <div
          style={{
            position: 'absolute',
            left: -(indentSize - horizontalDash / 2),
            top: '50%',
            width: horizontalDash,
            height: connectorWidth,
            background: connectorColor,
            transform: 'translateY(-50%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Node content */}
      <div style={{ paddingTop: depth > 0 ? 6 : 0, paddingBottom: 6 }}>
        {node.tooltip ? (
          <DiagramTooltip content={node.tooltip}>
            {nodeBox}
          </DiagramTooltip>
        ) : (
          nodeBox
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div
          style={{
            paddingLeft: indentSize,
            position: 'relative',
          }}
        >
          {node.children!.map((child, i) => (
            <TreeNodeComponent
              key={i}
              node={child}
              isLast={i === node.children!.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  ClassificationTree                                                 */
/* ================================================================== */

/**
 * ClassificationTree
 *
 * Renders a recursive tree hierarchy from a TreeNode[] prop.
 * Each node shows a glass-styled box with color accent, label, and level badge.
 * CSS connector lines link parent nodes to children with indentation.
 */
export function ClassificationTree({ tree, title }: ClassificationTreeProps) {
  return (
    <DiagramContainer
      title={title || '\u041A\u043B\u0430\u0441\u0441\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445'}
      color="blue"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        role="tree"
        aria-label="Data classification hierarchy"
      >
        {tree.map((node, i) => (
          <TreeNodeComponent
            key={i}
            node={node}
            isLast={i === tree.length - 1}
            depth={0}
          />
        ))}
      </div>
    </DiagramContainer>
  );
}
