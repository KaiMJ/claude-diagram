import type { CSSProperties } from "react";

// Node style definitions - uses CSS variables from globals.css
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
    background: "var(--node-default-bg)",
    border: "1px solid var(--node-default-border)",
    borderRadius: "8px",
    color: "var(--node-default-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  gold: {
    background: "var(--node-gold-bg)",
    border: "2px solid var(--node-gold-border)",
    borderRadius: "8px",
    color: "var(--node-gold-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  silver: {
    background: "var(--node-silver-bg)",
    border: "2px solid var(--node-silver-border)",
    borderRadius: "8px",
    color: "var(--node-silver-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  bronze: {
    background: "var(--node-bronze-bg)",
    border: "2px solid var(--node-bronze-border)",
    borderRadius: "8px",
    color: "var(--node-bronze-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  primary: {
    background: "var(--node-primary-bg)",
    border: "2px solid var(--node-primary-border)",
    borderRadius: "8px",
    color: "var(--node-primary-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  success: {
    background: "var(--node-success-bg)",
    border: "2px solid var(--node-success-border)",
    borderRadius: "8px",
    color: "var(--node-success-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  warning: {
    background: "var(--node-warning-bg)",
    border: "2px solid var(--node-warning-border)",
    borderRadius: "8px",
    color: "var(--node-warning-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
  },
  error: {
    background: "var(--node-error-bg)",
    border: "2px solid var(--node-error-border)",
    borderRadius: "8px",
    color: "var(--node-error-text)",
    boxShadow: "0 1px 3px var(--node-default-shadow)",
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
    background: "var(--group-control-bg)",
    border: "2px dashed var(--group-control-border)",
    borderRadius: "12px",
  },
  bronze: {
    background: "var(--group-bronze-bg)",
    border: "2px dashed var(--group-bronze-border)",
    borderRadius: "12px",
  },
  silver: {
    background: "var(--group-silver-bg)",
    border: "2px dashed var(--group-silver-border)",
    borderRadius: "12px",
  },
  gold: {
    background: "var(--group-gold-bg)",
    border: "2px dashed var(--group-gold-border)",
    borderRadius: "12px",
  },
  queryEngine: {
    background: "var(--group-query-bg)",
    border: "2px dashed var(--group-query-border)",
    borderRadius: "12px",
  },
  external: {
    background: "var(--group-external-bg)",
    border: "2px dashed var(--group-external-border)",
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
    stroke: "var(--edge-standard)",
    strokeWidth: 2,
  },
  dashed: {
    stroke: "var(--edge-standard)",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
  longDashed: {
    stroke: "var(--edge-standard)",
    strokeWidth: 2,
    strokeDasharray: "10,10",
  },
  read: {
    stroke: "var(--edge-read)",
    strokeWidth: 2,
  },
  write: {
    stroke: "var(--edge-write)",
    strokeWidth: 2,
  },
  error: {
    stroke: "var(--edge-error)",
    strokeWidth: 2,
  },
  reference: {
    stroke: "var(--edge-reference)",
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
