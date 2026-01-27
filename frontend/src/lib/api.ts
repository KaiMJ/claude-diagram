import type { Node, Edge } from "@xyflow/react";
import { getNodeStyle, getGroupStyle, getEdgeStyle } from "./styles";
import type {
  DiagramCategory,
  DiagramListMeta,
  MasterDiagram,
  YamlNode,
  YamlGroup,
  YamlEdge,
  DiagramData,
  LayoutData,
  Annotation,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Re-export types for backwards compatibility
export type { DiagramCategory, DiagramListMeta as DiagramMeta, MasterDiagram, DiagramData, LayoutData };

// Helper to group annotations by target node
function groupAnnotationsByNode(annotations: Annotation[]): Map<string, Annotation[]> {
  const map = new Map<string, Annotation[]>();
  for (const ann of annotations) {
    if (ann.targetType === "node") {
      const existing = map.get(ann.targetId) || [];
      existing.push(ann);
      map.set(ann.targetId, existing);
    }
  }
  return map;
}

// API functions
export async function fetchDiagramList(): Promise<MasterDiagram> {
  const res = await fetch(`${API_BASE}/diagrams`);
  if (!res.ok) throw new Error("Failed to fetch diagram list");
  return res.json();
}

export async function fetchDiagram(slug: string): Promise<DiagramData> {
  const res = await fetch(`${API_BASE}/diagrams/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch diagram: ${slug}`);
  return res.json();
}

export async function fetchLayout(slug: string): Promise<LayoutData | null> {
  const res = await fetch(`${API_BASE}/layouts/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch layout: ${slug}`);
  return res.json();
}

export async function saveLayout(slug: string, nodes: Node[], edges: Edge[]): Promise<void> {
  const layoutData: LayoutData = {
    nodes: nodes.map((n) => ({
      id: n.id,
      position: n.position,
      width: n.measured?.width ?? (n.style?.width as number | undefined),
      height: n.measured?.height ?? (n.style?.height as number | undefined),
    })),
    edges: edges.map((e) => ({ id: e.id })),
  };

  const res = await fetch(`${API_BASE}/layouts/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(layoutData),
  });

  if (!res.ok) throw new Error(`Failed to save layout: ${slug}`);
}

// Convert YAML data to React Flow nodes/edges
export function convertToReactFlow(
  data: DiagramData,
  savedLayout?: LayoutData | null
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const layoutMap = new Map(savedLayout?.nodes.map((n) => [n.id, n]) || []);
  const annotationMap = groupAnnotationsByNode(data.annotations || []);

  // Convert groups first (they need to exist before child nodes)
  for (const group of data.groups || []) {
    const saved = layoutMap.get(group.id);
    const style = getGroupStyle(group.style || "controlPlane");

    nodes.push({
      id: group.id,
      type: "resizableGroup",
      position: saved?.position || { x: 0, y: 0 },
      data: {
        label: group.label,
        styleKey: group.style || "controlPlane",
        status: group.status,
        metadata: group.metadata,
        annotations: annotationMap.get(group.id) || [],
      },
      style: {
        ...style,
        width: saved?.width || 300,
        height: saved?.height || 200,
      },
      parentId: group.parent || undefined,
    });
  }

  // Convert nodes
  for (const node of data.nodes || []) {
    const saved = layoutMap.get(node.id);
    const style = getNodeStyle(node.style || "default");

    nodes.push({
      id: node.id,
      type: "resizable",
      position: saved?.position || { x: 0, y: 0 },
      data: {
        label: node.label,
        styleKey: node.style || "default",
        status: node.status,
        metadata: node.metadata,
        annotations: annotationMap.get(node.id) || [],
      },
      style: {
        ...style,
        width: saved?.width || 180,
        height: saved?.height || 60,
      },
      parentId: node.parent || undefined,
    });
  }

  // Convert edges
  for (const edge of data.edges || []) {
    const styleDef = getEdgeStyle(edge.style || "standard");

    edges.push({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated || styleDef.animated || false,
      data: { styleKey: edge.style || "standard" },
      style: {
        stroke: styleDef.stroke,
        strokeWidth: styleDef.strokeWidth,
        strokeDasharray: styleDef.strokeDasharray,
      },
    });
  }

  return { nodes, edges };
}
