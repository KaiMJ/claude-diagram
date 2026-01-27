"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeResizer, type NodeProps, type Node } from "@xyflow/react";
import type { NodeStatus, NodeMetadata, Annotation } from "@/lib/types";
import { getAnnotationStyle } from "@/lib/styles";
import StatusBadge from "./StatusBadge";

interface ResizableNodeData extends Record<string, unknown> {
  label: string;
  status?: NodeStatus;
  metadata?: NodeMetadata;
  annotations?: Annotation[];
}

type ResizableNodeType = Node<ResizableNodeData, "resizable">;

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
        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-help shadow-sm"
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
          className="absolute left-6 top-0 z-50 w-40 p-2 rounded shadow-lg text-[10px] leading-tight pointer-events-none"
          style={{
            backgroundColor: "var(--card)",
            border: `1px solid ${style.color}`,
          }}
        >
          <div className="font-semibold mb-0.5" style={{ color: style.color }}>
            {style.label}
          </div>
          <div style={{ color: "var(--foreground)" }}>{annotation.message}</div>
        </div>
      )}
    </div>
  );
}

function ResizableNode({ data, selected }: NodeProps<ResizableNodeType>) {
  const { label, status, annotations = [] } = data as ResizableNodeData;
  const hasIndicators = status || annotations.length > 0;

  return (
    <div className="relative w-full h-full px-3 py-2 text-center font-medium flex items-center justify-center whitespace-pre-line text-xs">
      <NodeResizer
        minWidth={100}
        minHeight={40}
        isVisible={selected}
        lineClassName="!border-primary"
        handleClassName="!w-2 !h-2 !bg-primary !border-white"
      />

      {/* Status and Annotation indicators in top-right corner */}
      {hasIndicators && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
          {annotations.map((ann) => (
            <AnnotationIcon key={ann.id} annotation={ann} />
          ))}
          {status && <StatusBadge status={status} size="sm" />}
        </div>
      )}

      {/* Vertical layout handles */}
      <Handle id="top" type="target" position={Position.Top} className="invisible" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="invisible" />
      {/* Horizontal layout handles */}
      <Handle id="left" type="target" position={Position.Left} className="invisible" />
      <Handle id="right" type="source" position={Position.Right} className="invisible" />

      {label}
    </div>
  );
}

export default memo(ResizableNode);
