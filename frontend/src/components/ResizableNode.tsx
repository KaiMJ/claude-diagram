"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps, type Node } from "@xyflow/react";

type ResizableNodeType = Node<{ label: string }, "resizable">;

function ResizableNode({ data, selected }: NodeProps<ResizableNodeType>) {
  const label = (data as { label: string }).label;
  return (
    <div className="w-full h-full px-3 py-2 text-center font-medium flex items-center justify-center whitespace-pre-line text-xs">
      <NodeResizer
        minWidth={100}
        minHeight={40}
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
      {label}
    </div>
  );
}

export default memo(ResizableNode);
