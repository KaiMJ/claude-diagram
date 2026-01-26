"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps, type Node } from "@xyflow/react";

type ResizableGroupNodeData = Node<{ label: string }, "resizableGroup">;

function ResizableGroupNode({ data, selected }: NodeProps<ResizableGroupNodeData>) {
  const label = (data as { label: string }).label;
  return (
    <div className="w-full h-full relative">
      <NodeResizer
        minWidth={200}
        minHeight={100}
        isVisible={selected}
        lineClassName="!border-primary"
        handleClassName="!w-2 !h-2 !bg-primary !border-white"
      />
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
