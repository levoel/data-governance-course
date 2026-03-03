/**
 * OrgChart Diagrams (DIAG-04)
 *
 * Exports:
 * - OrgChart: Hierarchical tree of governance roles with connecting lines
 */

import { DiagramContainer } from '@primitives/DiagramContainer';
import { DiagramTooltip } from '@primitives/Tooltip';
import { colors, glassStyle } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface OrgNode {
  id: string;
  label: string;
  role: string;
  parent?: string;
  tooltip?: string;
}

interface OrgChartProps {
  nodes: OrgNode[];
  title?: string;
}

/* ================================================================== */
/*  Internal tree types                                                */
/* ================================================================== */

interface TreeNode {
  node: OrgNode;
  children: TreeNode[];
  depth: number;
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

const LEVEL_COLORS = [
  colors.primary,  // level 0 - indigo
  colors.accent,   // level 1 - cyan
  colors.success,  // level 2 - emerald
  colors.warning,  // level 3+ - amber
];

function getLevelColor(depth: number): string {
  return LEVEL_COLORS[Math.min(depth, LEVEL_COLORS.length - 1)];
}

function buildTree(nodes: OrgNode[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create tree nodes
  for (const node of nodes) {
    nodeMap.set(node.id, { node, children: [], depth: 0 });
  }

  // Build parent-child relationships
  for (const node of nodes) {
    const treeNode = nodeMap.get(node.id)!;
    if (node.parent && nodeMap.has(node.parent)) {
      const parentTree = nodeMap.get(node.parent)!;
      parentTree.children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }

  // Assign depths
  function assignDepth(node: TreeNode, depth: number) {
    node.depth = depth;
    for (const child of node.children) {
      assignDepth(child, depth + 1);
    }
  }
  for (const root of roots) {
    assignDepth(root, 0);
  }

  return roots;
}

/* ================================================================== */
/*  OrgNodeCard                                                        */
/* ================================================================== */

function OrgNodeCard({ node, depth }: { node: OrgNode; depth: number }) {
  const borderColor = getLevelColor(depth);

  const card = (
    <div
      style={{
        ...glassStyle,
        padding: '10px 14px',
        borderLeft: `3px solid ${borderColor}`,
        minWidth: 140,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: colors.text,
          fontFamily: 'monospace',
          marginBottom: 2,
        }}
      >
        {node.label}
      </div>
      <div
        style={{
          fontSize: 10,
          color: colors.textMuted,
          fontFamily: 'monospace',
        }}
      >
        {node.role}
      </div>
    </div>
  );

  if (node.tooltip) {
    return (
      <DiagramTooltip content={node.tooltip}>
        <div tabIndex={0}>{card}</div>
      </DiagramTooltip>
    );
  }

  return card;
}

/* ================================================================== */
/*  TreeBranch (recursive renderer)                                    */
/* ================================================================== */

function TreeBranch({ treeNode }: { treeNode: TreeNode }) {
  const hasChildren = treeNode.children.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Node card */}
      <OrgNodeCard node={treeNode.node} depth={treeNode.depth} />

      {hasChildren && (
        <>
          {/* Vertical connector from parent to horizontal line */}
          <div
            style={{
              width: 2,
              height: 16,
              background: 'rgba(255,255,255,0.15)',
            }}
          />

          {/* Children container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 0,
              position: 'relative',
            }}
          >
            {/* Horizontal connector line */}
            {treeNode.children.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  right: '25%',
                  height: 2,
                  background: 'rgba(255,255,255,0.15)',
                }}
              />
            )}

            {/* Child branches */}
            {treeNode.children.map((child) => (
              <div
                key={child.node.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 12px',
                }}
              >
                {/* Vertical connector from horizontal line to child */}
                <div
                  style={{
                    width: 2,
                    height: 16,
                    background: 'rgba(255,255,255,0.15)',
                  }}
                />
                <TreeBranch treeNode={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  OrgChart                                                           */
/* ================================================================== */

/**
 * OrgChart
 *
 * Renders a hierarchical tree of governance roles from a flat node list.
 * Root nodes have no parent. Depth-based left-accent coloring on each card.
 * Responsive: stacks vertically on narrow viewports via flex-wrap.
 */
export function OrgChart({ nodes, title }: OrgChartProps) {
  const tree = buildTree(nodes);

  return (
    <DiagramContainer
      title={title || 'Организационная структура Data Governance'}
      color="rose"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          padding: '8px 0',
        }}
      >
        {tree.map((root) => (
          <TreeBranch key={root.node.id} treeNode={root} />
        ))}
      </div>
    </DiagramContainer>
  );
}
