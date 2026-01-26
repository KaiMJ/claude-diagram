"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ResizableNode from "./ResizableNode";
import ResizableGroupNode from "./ResizableGroupNode";
import { fetchDiagram, fetchLayout, saveLayout, convertToReactFlow } from "@/lib/api";
import { applyDagreLayout, type LayoutDirection } from "@/lib/layout";
import { cn } from "@/lib/utils";

const nodeTypes = {
  resizable: ResizableNode,
  resizableGroup: ResizableGroupNode,
};

interface DiagramViewerInnerProps {
  slug: string;
}

function DiagramViewerInner({ slug }: DiagramViewerInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<LayoutDirection>("TB");
  const { fitView } = useReactFlow();

  // Store original converted nodes/edges for re-layout
  const originalDataRef = useRef<{ nodes: Node[]; edges: Edge[] } | null>(null);

  // Load diagram data (only when slug changes)
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([fetchDiagram(slug), fetchLayout(slug)])
      .then(([diagramData, layoutData]) => {
        const { nodes: convertedNodes, edges: convertedEdges } = convertToReactFlow(
          diagramData,
          layoutData
        );

        // Store original data for re-layout
        originalDataRef.current = { nodes: convertedNodes, edges: convertedEdges };

        // If no saved layout, apply auto-layout with default direction
        if (!layoutData) {
          const { nodes: layoutedNodes } = applyDagreLayout(convertedNodes, convertedEdges, {
            direction: "TB",
          });
          setNodes(layoutedNodes);
        } else {
          setNodes(convertedNodes);
        }
        setEdges(convertedEdges);
        setLoading(false);

        // Fit view after nodes are set
        setTimeout(() => fitView({ padding: 0.1 }), 100);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, setNodes, setEdges, fitView]);

  // Apply layout using original data
  const handleLayout = useCallback(
    (dir: LayoutDirection) => {
      if (!originalDataRef.current) return;

      setDirection(dir);
      const { nodes: layoutedNodes } = applyDagreLayout(
        originalDataRef.current.nodes,
        originalDataRef.current.edges,
        { direction: dir }
      );
      setNodes(layoutedNodes);
      setTimeout(() => fitView({ padding: 0.1 }), 100);
    },
    [setNodes, fitView]
  );

  // Reset layout
  const handleReset = useCallback(() => {
    handleLayout(direction);
  }, [handleLayout, direction]);

  // Save layout
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveLayout(slug, nodes, edges);
    } catch (err) {
      console.error("Failed to save layout:", err);
    }
    setSaving(false);
  }, [slug, nodes, edges]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      nodeDragThreshold={1}
      fitView
      minZoom={0.1}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} size={1} />
      <Controls />
      <Panel position="top-right" className="flex gap-2">
        <button
          onClick={() => handleLayout("TB")}
          className={cn(
            "px-3 py-1.5 text-sm rounded border transition-colors",
            direction === "TB"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white hover:bg-secondary border-border"
          )}
        >
          Vertical
        </button>
        <button
          onClick={() => handleLayout("LR")}
          className={cn(
            "px-3 py-1.5 text-sm rounded border transition-colors",
            direction === "LR"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white hover:bg-secondary border-border"
          )}
        >
          Horizontal
        </button>
        <button
          onClick={() => fitView({ padding: 0.1 })}
          className="px-3 py-1.5 text-sm rounded border border-border bg-white hover:bg-secondary transition-colors"
        >
          Fit View
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm rounded border border-border bg-white hover:bg-secondary transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 text-sm rounded border border-border bg-white hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </Panel>
    </ReactFlow>
  );
}

interface DiagramViewerProps {
  slug: string;
}

export default function DiagramViewer({ slug }: DiagramViewerProps) {
  return (
    <ReactFlowProvider>
      <DiagramViewerInner slug={slug} />
    </ReactFlowProvider>
  );
}
