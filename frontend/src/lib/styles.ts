import type { CSSProperties } from "react";

// Node style definitions
export type NodeStyleKey =
  | "default"
  | "gold"
  | "silver"
  | "bronze"
  | "primary"
  | "success"
  | "warning"
  | "error";

export const nodeStyles: Record<NodeStyleKey, CSSProperties> = {
  default: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#1e293b",
  },
  gold: {
    background: "#fef3c7",
    border: "2px solid #f59e0b",
    borderRadius: "8px",
    color: "#92400e",
  },
  silver: {
    background: "#f1f5f9",
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    color: "#475569",
  },
  bronze: {
    background: "#fed7aa",
    border: "2px solid #ea580c",
    borderRadius: "8px",
    color: "#9a3412",
  },
  primary: {
    background: "#dbeafe",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    color: "#1e40af",
  },
  success: {
    background: "#dcfce7",
    border: "2px solid #22c55e",
    borderRadius: "8px",
    color: "#166534",
  },
  warning: {
    background: "#fef9c3",
    border: "2px solid #eab308",
    borderRadius: "8px",
    color: "#854d0e",
  },
  error: {
    background: "#fee2e2",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    color: "#991b1b",
  },
};

// Group style definitions
export type GroupStyleKey =
  | "controlPlane"
  | "bronze"
  | "silver"
  | "gold"
  | "queryEngine"
  | "external";

export const groupStyles: Record<GroupStyleKey, CSSProperties> = {
  controlPlane: {
    background: "rgba(147, 51, 234, 0.08)",
    border: "2px dashed #9333ea",
    borderRadius: "12px",
  },
  bronze: {
    background: "rgba(234, 88, 12, 0.08)",
    border: "2px dashed #ea580c",
    borderRadius: "12px",
  },
  silver: {
    background: "rgba(148, 163, 184, 0.08)",
    border: "2px dashed #94a3b8",
    borderRadius: "12px",
  },
  gold: {
    background: "rgba(245, 158, 11, 0.08)",
    border: "2px dashed #f59e0b",
    borderRadius: "12px",
  },
  queryEngine: {
    background: "rgba(59, 130, 246, 0.08)",
    border: "2px dashed #3b82f6",
    borderRadius: "12px",
  },
  external: {
    background: "rgba(107, 114, 128, 0.08)",
    border: "2px dashed #6b7280",
    borderRadius: "12px",
  },
};

// Edge style definitions
export type EdgeStyleKey =
  | "standard"
  | "dashed"
  | "longDashed"
  | "read"
  | "write"
  | "error"
  | "reference";

export interface EdgeStyleDef {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  animated?: boolean;
}

export const edgeStyles: Record<EdgeStyleKey, EdgeStyleDef> = {
  standard: {
    stroke: "#64748b",
    strokeWidth: 2,
  },
  dashed: {
    stroke: "#64748b",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
  longDashed: {
    stroke: "#64748b",
    strokeWidth: 2,
    strokeDasharray: "10,10",
  },
  read: {
    stroke: "#22c55e",
    strokeWidth: 2,
  },
  write: {
    stroke: "#3b82f6",
    strokeWidth: 2,
  },
  error: {
    stroke: "#ef4444",
    strokeWidth: 2,
  },
  reference: {
    stroke: "#a855f7",
    strokeWidth: 1,
    strokeDasharray: "3,3",
  },
};

export function getNodeStyle(styleKey: string): CSSProperties {
  return nodeStyles[styleKey as NodeStyleKey] || nodeStyles.default;
}

export function getGroupStyle(styleKey: string): CSSProperties {
  return groupStyles[styleKey as GroupStyleKey] || groupStyles.controlPlane;
}

export function getEdgeStyle(styleKey: string): EdgeStyleDef {
  return edgeStyles[styleKey as EdgeStyleKey] || edgeStyles.standard;
}
