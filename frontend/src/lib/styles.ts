import type { CSSProperties } from "react";

// Node style definitions - using box-shadow for better visibility
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
    background: "hsl(var(--node-default-bg))",
    border: "1px solid hsl(var(--node-default-border))",
    borderRadius: "8px",
    color: "hsl(var(--node-default-text))",
    boxShadow: "0 1px 3px hsl(var(--foreground) / 0.1)",
  },
  gold: {
    background: "#fef3c7",
    border: "2px solid #f59e0b",
    borderRadius: "8px",
    color: "#92400e",
    boxShadow: "0 1px 3px rgba(245, 158, 11, 0.3)",
  },
  silver: {
    background: "#f1f5f9",
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    color: "#475569",
    boxShadow: "0 1px 3px rgba(148, 163, 184, 0.3)",
  },
  bronze: {
    background: "#fed7aa",
    border: "2px solid #ea580c",
    borderRadius: "8px",
    color: "#9a3412",
    boxShadow: "0 1px 3px rgba(234, 88, 12, 0.3)",
  },
  primary: {
    background: "#dbeafe",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    color: "#1e40af",
    boxShadow: "0 1px 3px rgba(59, 130, 246, 0.3)",
  },
  success: {
    background: "#dcfce7",
    border: "2px solid #22c55e",
    borderRadius: "8px",
    color: "#166534",
    boxShadow: "0 1px 3px rgba(34, 197, 94, 0.3)",
  },
  warning: {
    background: "#fef9c3",
    border: "2px solid #eab308",
    borderRadius: "8px",
    color: "#854d0e",
    boxShadow: "0 1px 3px rgba(234, 179, 8, 0.3)",
  },
  error: {
    background: "#fee2e2",
    border: "2px solid #ef4444",
    borderRadius: "8px",
    color: "#991b1b",
    boxShadow: "0 1px 3px rgba(239, 68, 68, 0.3)",
  },
};

// Dark mode node styles
export const darkNodeStyles: Record<NodeStyleKey, CSSProperties> = {
  default: {
    background: "hsl(var(--node-default-bg))",
    border: "1px solid hsl(var(--node-default-border))",
    borderRadius: "8px",
    color: "hsl(var(--node-default-text))",
    boxShadow: "0 1px 3px hsl(var(--foreground) / 0.1)",
  },
  gold: {
    background: "#78350f",
    border: "2px solid #fbbf24",
    borderRadius: "8px",
    color: "#fef3c7",
    boxShadow: "0 1px 3px rgba(251, 191, 36, 0.2)",
  },
  silver: {
    background: "#334155",
    border: "2px solid #94a3b8",
    borderRadius: "8px",
    color: "#e2e8f0",
    boxShadow: "0 1px 3px rgba(148, 163, 184, 0.2)",
  },
  bronze: {
    background: "#7c2d12",
    border: "2px solid #fb923c",
    borderRadius: "8px",
    color: "#fed7aa",
    boxShadow: "0 1px 3px rgba(251, 146, 60, 0.2)",
  },
  primary: {
    background: "#1e3a8a",
    border: "2px solid #60a5fa",
    borderRadius: "8px",
    color: "#dbeafe",
    boxShadow: "0 1px 3px rgba(96, 165, 250, 0.2)",
  },
  success: {
    background: "#14532d",
    border: "2px solid #4ade80",
    borderRadius: "8px",
    color: "#dcfce7",
    boxShadow: "0 1px 3px rgba(74, 222, 128, 0.2)",
  },
  warning: {
    background: "#713f12",
    border: "2px solid #facc15",
    borderRadius: "8px",
    color: "#fef9c3",
    boxShadow: "0 1px 3px rgba(250, 204, 21, 0.2)",
  },
  error: {
    background: "#7f1d1d",
    border: "2px solid #f87171",
    borderRadius: "8px",
    color: "#fee2e2",
    boxShadow: "0 1px 3px rgba(248, 113, 113, 0.2)",
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

// Dark mode group styles
export const darkGroupStyles: Record<GroupStyleKey, CSSProperties> = {
  controlPlane: {
    background: "rgba(147, 51, 234, 0.15)",
    border: "2px dashed #a855f7",
    borderRadius: "12px",
  },
  bronze: {
    background: "rgba(234, 88, 12, 0.15)",
    border: "2px dashed #fb923c",
    borderRadius: "12px",
  },
  silver: {
    background: "rgba(148, 163, 184, 0.15)",
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
  },
  gold: {
    background: "rgba(245, 158, 11, 0.15)",
    border: "2px dashed #fbbf24",
    borderRadius: "12px",
  },
  queryEngine: {
    background: "rgba(59, 130, 246, 0.15)",
    border: "2px dashed #60a5fa",
    borderRadius: "12px",
  },
  external: {
    background: "rgba(107, 114, 128, 0.15)",
    border: "2px dashed #9ca3af",
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

// Dark mode edge styles (lighter colors for visibility)
export const darkEdgeStyles: Record<EdgeStyleKey, EdgeStyleDef> = {
  standard: {
    stroke: "#94a3b8",
    strokeWidth: 2,
  },
  dashed: {
    stroke: "#94a3b8",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
  longDashed: {
    stroke: "#94a3b8",
    strokeWidth: 2,
    strokeDasharray: "10,10",
  },
  read: {
    stroke: "#4ade80",
    strokeWidth: 2,
  },
  write: {
    stroke: "#60a5fa",
    strokeWidth: 2,
  },
  error: {
    stroke: "#f87171",
    strokeWidth: 2,
  },
  reference: {
    stroke: "#c084fc",
    strokeWidth: 1,
    strokeDasharray: "3,3",
  },
};

export function getNodeStyle(styleKey: string, isDark = false): CSSProperties {
  const styles = isDark ? darkNodeStyles : nodeStyles;
  return styles[styleKey as NodeStyleKey] || styles.default;
}

export function getGroupStyle(styleKey: string, isDark = false): CSSProperties {
  const styles = isDark ? darkGroupStyles : groupStyles;
  return styles[styleKey as GroupStyleKey] || styles.controlPlane;
}

export function getEdgeStyle(styleKey: string, isDark = false): EdgeStyleDef {
  const styles = isDark ? darkEdgeStyles : edgeStyles;
  return styles[styleKey as EdgeStyleKey] || styles.standard;
}
