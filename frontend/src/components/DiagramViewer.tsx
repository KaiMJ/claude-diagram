"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  SelectionMode,
  type Node,
  type Edge,
  type OnSelectionChangeFunc,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

import ResizableNode from "./ResizableNode";
import ResizableGroupNode from "./ResizableGroupNode";
import { fetchDiagram, fetchLayout, saveLayout, convertToReactFlow } from "@/lib/api";
import { applyDagreLayout, type LayoutDirection } from "@/lib/layout";
import { getNodeStyle, getGroupStyle, getEdgeStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

const nodeTypes = {
  resizable: ResizableNode,
  resizableGroup: ResizableGroupNode,
};

interface DiagramViewerInnerProps {
  slug: string;
}

interface DiagramDataRef {
  nodes: Node[];
  edges: Edge[];
}

function DiagramViewerInner({ slug }: DiagramViewerInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<LayoutDirection>("TB");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Store original converted nodes/edges for re-layout
  const originalDataRef = useRef<DiagramDataRef | null>(null);
  // Store raw diagram data for theme changes
  const rawDataRef = useRef<{ diagramData: unknown; layoutData: unknown } | null>(null);

  // Build adjacency map for finding connected nodes
  const adjacencyMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const edge of edges) {
      if (!map.has(edge.source)) map.set(edge.source, new Set());
      if (!map.has(edge.target)) map.set(edge.target, new Set());
      map.get(edge.source)!.add(edge.target);
      map.get(edge.target)!.add(edge.source);
    }
    return map;
  }, [edges]);

  // Compute highlighted nodes and edges based on selection (supports multi-select)
  const { highlightedNodeIds, highlightedEdgeIds } = useMemo(() => {
    if (selectedIds.size === 0) {
      return { highlightedNodeIds: new Set<string>(), highlightedEdgeIds: new Set<string>() };
    }

    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();

    for (const selectedId of selectedIds) {
      const selectedNode = nodes.find((n) => n.id === selectedId);
      if (!selectedNode) continue;

      const isGroup = selectedNode.type === "resizableGroup";

      if (isGroup) {
        // Highlight the group itself
        nodeIds.add(selectedId);
        // Highlight all children of this group
        for (const node of nodes) {
          if (node.parentId === selectedId) {
            nodeIds.add(node.id);
          }
        }
      } else {
        // Highlight the selected node
        nodeIds.add(selectedId);
        // Highlight directly connected nodes
        const connected = adjacencyMap.get(selectedId);
        if (connected) {
          for (const connectedId of connected) {
            nodeIds.add(connectedId);
          }
        }
        // Highlight edges connected to the selected node
        for (const edge of edges) {
          if (edge.source === selectedId || edge.target === selectedId) {
            edgeIds.add(edge.id);
          }
        }
      }
    }

    // For groups, highlight edges between highlighted nodes
    for (const edge of edges) {
      if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
        edgeIds.add(edge.id);
      }
    }

    return { highlightedNodeIds: nodeIds, highlightedEdgeIds: edgeIds };
  }, [selectedIds, nodes, edges, adjacencyMap]);

  // Apply highlight styles to nodes
  const styledNodes = useMemo(() => {
    const hasSelection = selectedIds.size > 0;

    return nodes.map((node) => {
      const isHighlighted = highlightedNodeIds.has(node.id);
      const isSelected = selectedIds.has(node.id);

      // Apply theme-aware styles
      const styleKey = (node.data as { styleKey?: string })?.styleKey;
      const isGroup = node.type === "resizableGroup";
      const baseStyle = isGroup
        ? getGroupStyle(styleKey || "controlPlane", isDark)
        : getNodeStyle(styleKey || "default", isDark);

      return {
        ...node,
        style: {
          ...baseStyle,
          width: node.style?.width,
          height: node.style?.height,
        },
        className: cn(
          node.className,
          hasSelection && !isHighlighted && "opacity-30 transition-opacity",
          isSelected && "ring-2 ring-primary ring-offset-2"
        ),
      };
    });
  }, [nodes, selectedIds, highlightedNodeIds, isDark]);

  // Apply highlight styles to edges
  const styledEdges = useMemo(() => {
    const hasSelection = selectedIds.size > 0;

    return edges.map((edge) => {
      const isHighlighted = highlightedEdgeIds.has(edge.id);

      // Apply theme-aware styles
      const styleKey = (edge.data as { styleKey?: string })?.styleKey;
      const baseStyle = getEdgeStyle(styleKey || "standard", isDark);

      return {
        ...edge,
        animated: hasSelection ? isHighlighted : edge.animated,
        style: {
          stroke: baseStyle.stroke,
          strokeWidth: hasSelection && isHighlighted ? 3 : baseStyle.strokeWidth,
          strokeDasharray: baseStyle.strokeDasharray,
          opacity: hasSelection && !isHighlighted ? 0.2 : 1,
        },
      };
    });
  }, [edges, selectedIds, highlightedEdgeIds, isDark]);

  // Handle selection change from React Flow (supports multi-select with Shift/Cmd)
  const handleSelectionChange: OnSelectionChangeFunc = useCallback(({ nodes: selectedNodes }) => {
    setSelectedIds(new Set(selectedNodes.map((n) => n.id)));
  }, []);

  // Handle pane click (clear selection)
  const handlePaneClick = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Load diagram data (only when slug changes)
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedIds(new Set());

    Promise.all([fetchDiagram(slug), fetchLayout(slug)])
      .then(([diagramData, layoutData]) => {
        // Store raw data for theme changes
        rawDataRef.current = { diagramData, layoutData };

        const { nodes: convertedNodes, edges: convertedEdges } = convertToReactFlow(
          diagramData,
          layoutData,
          { isDark }
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

        setTimeout(() => fitView({ padding: 0.1 }), 100);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, setNodes, setEdges, fitView, isDark]);

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
      <div className="flex h-full items-center justify-center text-muted-foreground bg-background">
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 bg-background">
        Error: {error}
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={styledNodes}
      edges={styledEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={handleSelectionChange}
      onPaneClick={handlePaneClick}
      nodeTypes={nodeTypes}
      nodeDragThreshold={1}
      selectionOnDrag
      selectionMode={SelectionMode.Partial}
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
              : "bg-card hover:bg-secondary border-border"
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
              : "bg-card hover:bg-secondary border-border"
          )}
        >
          Horizontal
        </button>
        <button
          onClick={() => fitView({ padding: 0.1 })}
          className="px-3 py-1.5 text-sm rounded border border-border bg-card hover:bg-secondary transition-colors"
        >
          Fit View
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm rounded border border-border bg-card hover:bg-secondary transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 text-sm rounded border border-border bg-card hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Layout"}
        </button>
        {selectedIds.size > 0 && (
          <button
            onClick={() => setSelectedIds(new Set())}
            className="px-3 py-1.5 text-sm rounded border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Clear ({selectedIds.size})
          </button>
        )}
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
