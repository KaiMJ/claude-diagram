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
      <Handle type="target" position={Position.Top} className="invisible" />
      <Handle type="source" position={Position.Bottom} className="invisible" />
      {label}
    </div>
  );
}

export default memo(ResizableNode);
