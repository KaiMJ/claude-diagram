"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeResizer, type NodeProps, type Node } from "@xyflow/react";
import type { NodeStatus, NodeMetadata, Annotation } from "@/lib/types";
import { getAnnotationStyle } from "@/lib/styles";
import StatusBadge from "./StatusBadge";

interface ResizableGroupNodeData extends Record<string, unknown> {
  label: string;
  status?: NodeStatus;
  metadata?: NodeMetadata;
  annotations?: Annotation[];
}

type ResizableGroupNodeType = Node<ResizableGroupNodeData, "resizableGroup">;

function AnnotationIcon({ annotation }: { annotation: Annotation }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const style = getAnnotationStyle(annotation.type);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-help shadow-sm"
        style={{
          backgroundColor: style.color,
          boxShadow: `0 0 0 2px var(--background)`,
        }}
        title={`${style.label}: ${annotation.message}`}
      >
        {annotation.type === "todo" && "!"}
        {annotation.type === "warning" && "⚠"}
        {annotation.type === "idea" && "💡"}
      </div>
      {showTooltip && (
        <div
          className="absolute left-7 top-0 z-50 w-48 p-2 rounded shadow-lg text-xs leading-tight pointer-events-none"
          style={{
            backgroundColor: "var(--card)",
            border: `1px solid ${style.color}`,
          }}
        >
          <div className="font-semibold mb-1" style={{ color: style.color }}>
            {style.label}
          </div>
          <div style={{ color: "var(--foreground)" }}>{annotation.message}</div>
        </div>
      )}
    </div>
  );
}

function ResizableGroupNode({ data, selected }: NodeProps<ResizableGroupNodeType>) {
  const { label, status, annotations = [] } = data as ResizableGroupNodeData;
  const hasIndicators = status || annotations.length > 0;

  return (
    <div className="w-full h-full relative">
      <NodeResizer
        minWidth={200}
        minHeight={100}
        isVisible={selected}
        lineClassName="!border-primary"
        handleClassName="!w-2 !h-2 !bg-primary !border-white"
      />

      {/* Status and Annotation indicators in top-right corner */}
      {hasIndicators && (
        <div className="absolute top-2 right-3 z-10 flex items-center gap-1">
          {annotations.map((ann) => (
            <AnnotationIcon key={ann.id} annotation={ann} />
          ))}
          {status && <StatusBadge status={status} size="md" />}
        </div>
      )}

      {/* Vertical layout handles */}
      <Handle id="top" type="target" position={Position.Top} className="invisible" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="invisible" />
      {/* Horizontal layout handles */}
      <Handle id="left" type="target" position={Position.Left} className="invisible" />
      <Handle id="right" type="source" position={Position.Right} className="invisible" />

      <div className="absolute top-2 left-3 text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
    </div>
  );
}

export default memo(ResizableGroupNode);
