// =============================================================================
// Centralized Type Definitions for Diagram System
// =============================================================================

// Status values for nodes - represents implementation progress
export type NodeStatus = "not_started" | "in_progress" | "implemented" | "tested" | "blocked";

// Annotation types for dev guidance
export type AnnotationType = "todo" | "warning" | "idea";

// Metadata attached to nodes for the detail panel
export interface NodeMetadata {
  file?: string;
  summary?: string;
  todos?: string[];
  links?: Array<{ label: string; url: string }>;
}

// YAML Schema Types
export interface YamlNode {
  id: string;
  label: string;
  style?: string;
  parent?: string;
  status?: NodeStatus;
  metadata?: NodeMetadata;
}

export interface YamlGroup {
  id: string;
  label: string;
  style?: string;
  parent?: string | null;
  status?: NodeStatus;
  metadata?: NodeMetadata;
}

export interface YamlEdge {
  source: string;
  target: string;
  label?: string;
  style?: string;
  animated?: boolean;
}

// Annotation definition in YAML
export interface Annotation {
  id: string;
  type: AnnotationType;
  message: string;
  targetId: string;
  targetType: "node" | "edge";
}

// Meta block for diagram-level info
export interface DiagramMeta {
  title?: string;
  description?: string;
}

// Complete diagram data structure
export interface DiagramData {
  slug: string;
  meta?: DiagramMeta;
  groups?: YamlGroup[];
  nodes?: YamlNode[];
  edges?: YamlEdge[];
  annotations?: Annotation[];
}

// Layout persistence
export interface LayoutData {
  nodes: { id: string; position: { x: number; y: number }; width?: number; height?: number }[];
  edges: { id: string }[];
}

// Diagram list/manifest types
export interface DiagramCategory {
  id: string;
  label: string;
  icon: string;
}

export interface DiagramListMeta {
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
}

export interface MasterDiagram {
  categories: DiagramCategory[];
  diagrams: DiagramListMeta[];
}

// Progress statistics
export interface ProgressStats {
  total: number;
  not_started: number;
  in_progress: number;
  implemented: number;
  tested: number;
  blocked: number;
  completedPercentage: number;
}
