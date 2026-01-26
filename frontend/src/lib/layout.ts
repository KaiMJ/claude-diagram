import Dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@xyflow/react";

export type LayoutDirection = "TB" | "LR";

const DEFAULT_NODE_WIDTH = 180;
const DEFAULT_NODE_HEIGHT = 60;
const GROUP_PADDING = 50;
const LABEL_HEIGHT = 30;

interface LayoutOptions {
  direction: LayoutDirection;
  nodeWidth?: number;
  nodeHeight?: number;
}

export function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  const { direction, nodeWidth = DEFAULT_NODE_WIDTH, nodeHeight = DEFAULT_NODE_HEIGHT } = options;

  // Separate groups and regular nodes
  const groupNodes = nodes.filter((n) => n.type === "resizableGroup");
  const regularNodes = nodes.filter((n) => n.type !== "resizableGroup");

  // Build parent -> children map
  const childrenMap = new Map<string, Node[]>();
  const orphanNodes: Node[] = [];

  for (const node of regularNodes) {
    const parent = node.parentId;
    if (parent) {
      if (!childrenMap.has(parent)) childrenMap.set(parent, []);
      childrenMap.get(parent)!.push(node);
    } else {
      orphanNodes.push(node);
    }
  }

  // Build node -> group map
  const nodeToGroup = new Map<string, string>();
  for (const node of regularNodes) {
    if (node.parentId) nodeToGroup.set(node.id, node.parentId);
  }

  // Step 1: Layout children within each group and calculate group sizes
  const groupSizes = new Map<string, { width: number; height: number }>();
  const childPositions = new Map<string, { x: number; y: number }>();

  for (const group of groupNodes) {
    const children = childrenMap.get(group.id) || [];

    if (children.length === 0) {
      groupSizes.set(group.id, { width: 200, height: 100 });
      continue;
    }

    // Create dagre graph for this group's children
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, nodesep: 30, ranksep: 50 });

    for (const child of children) {
      g.setNode(child.id, { width: nodeWidth, height: nodeHeight });
    }

    // Add edges that are internal to this group
    const childIds = new Set(children.map((c) => c.id));
    for (const edge of edges) {
      if (childIds.has(edge.source) && childIds.has(edge.target)) {
        g.setEdge(edge.source, edge.target);
      }
    }

    Dagre.layout(g);

    // Calculate bounds and store child positions
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const child of children) {
      const pos = g.node(child.id);
      const x = pos.x - nodeWidth / 2;
      const y = pos.y - nodeHeight / 2;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + nodeWidth);
      maxY = Math.max(maxY, y + nodeHeight);
    }

    // Store relative positions for children (relative to group top-left)
    for (const child of children) {
      const pos = g.node(child.id);
      childPositions.set(child.id, {
        x: pos.x - nodeWidth / 2 - minX + GROUP_PADDING / 2,
        y: pos.y - nodeHeight / 2 - minY + GROUP_PADDING / 2 + LABEL_HEIGHT,
      });
    }

    // Calculate group size
    const groupWidth = maxX - minX + GROUP_PADDING;
    const groupHeight = maxY - minY + GROUP_PADDING + LABEL_HEIGHT;
    groupSizes.set(group.id, { width: groupWidth, height: groupHeight });
  }

  // Step 2: Create a top-level graph with groups and orphan nodes
  const topLevelGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  topLevelGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

  // Add groups to top-level graph
  for (const group of groupNodes) {
    const size = groupSizes.get(group.id) || { width: 200, height: 100 };
    topLevelGraph.setNode(group.id, { width: size.width, height: size.height });
  }

  // Add orphan nodes to top-level graph
  for (const orphan of orphanNodes) {
    topLevelGraph.setNode(orphan.id, { width: nodeWidth, height: nodeHeight });
  }

  // Add edges between top-level elements
  const addedEdges = new Set<string>();
  for (const edge of edges) {
    const srcGroup = nodeToGroup.get(edge.source);
    const tgtGroup = nodeToGroup.get(edge.target);

    // Get the top-level node for source and target
    const srcTopLevel = srcGroup || edge.source;
    const tgtTopLevel = tgtGroup || edge.target;

    // Only add if both exist in the top-level graph and they're different
    if (srcTopLevel !== tgtTopLevel) {
      const srcExists = topLevelGraph.hasNode(srcTopLevel);
      const tgtExists = topLevelGraph.hasNode(tgtTopLevel);

      if (srcExists && tgtExists) {
        const edgeKey = `${srcTopLevel}->${tgtTopLevel}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          topLevelGraph.setEdge(srcTopLevel, tgtTopLevel);
        }
      }
    }
  }

  Dagre.layout(topLevelGraph);

  // Step 3: Build final node positions
  const finalNodes: Node[] = [];

  // Position groups
  for (const group of groupNodes) {
    const pos = topLevelGraph.node(group.id);
    const size = groupSizes.get(group.id) || { width: 200, height: 100 };

    finalNodes.push({
      ...group,
      position: {
        x: pos.x - size.width / 2,
        y: pos.y - size.height / 2,
      },
      style: {
        ...group.style,
        width: size.width,
        height: size.height,
      },
    });
  }

  // Position orphan nodes
  for (const orphan of orphanNodes) {
    const pos = topLevelGraph.node(orphan.id);
    finalNodes.push({
      ...orphan,
      position: {
        x: pos.x - nodeWidth / 2,
        y: pos.y - nodeHeight / 2,
      },
    });
  }

  // Position child nodes (relative to their parent groups)
  for (const node of regularNodes) {
    if (!node.parentId) continue; // Skip orphans, already handled

    const relPos = childPositions.get(node.id);
    if (relPos) {
      finalNodes.push({
        ...node,
        position: relPos,
      });
    }
  }

  return { nodes: finalNodes, edges };
}
