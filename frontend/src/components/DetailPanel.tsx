"use client";

import { memo } from "react";
import type { NodeStatus, NodeMetadata } from "@/lib/types";
import { getStatusStyle } from "@/lib/styles";
import { X, FileCode, CheckSquare, ExternalLink } from "lucide-react";

interface DetailPanelProps {
  nodeId: string;
  label: string;
  status?: NodeStatus;
  metadata?: NodeMetadata;
  onClose: () => void;
}

function DetailPanel({ nodeId, label, status, metadata, onClose }: DetailPanelProps) {
  const statusStyle = getStatusStyle(status);

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-lg z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{label}</h3>
            <p className="text-xs text-muted-foreground">{nodeId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-secondary transition-colors"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Status Section */}
        <section>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Status
          </h4>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex items-center justify-center text-[8px]"
              style={{ backgroundColor: statusStyle.color, color: "#fff" }}
            >
              {statusStyle.icon}
            </span>
            <span className="text-sm">{statusStyle.label}</span>
          </div>
        </section>

        {/* File Path Section */}
        {metadata?.file && (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              File
            </h4>
            <div className="flex items-center gap-2 p-2 rounded bg-secondary/50 text-xs font-mono">
              <FileCode className="w-4 h-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{metadata.file}</span>
            </div>
          </section>
        )}

        {/* Summary Section */}
        {metadata?.summary && (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Summary
            </h4>
            <p className="text-sm text-foreground/90">{metadata.summary}</p>
          </section>
        )}

        {/* Todos Section */}
        {metadata?.todos && metadata.todos.length > 0 && (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              TODOs ({metadata.todos.length})
            </h4>
            <ul className="space-y-2">
              {metadata.todos.map((todo, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                  <span>{todo}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Links Section */}
        {metadata?.links && metadata.links.length > 0 && (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Links
            </h4>
            <div className="space-y-1">
              {metadata.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span className="text-primary hover:underline">{link.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* No metadata message */}
        {!metadata?.file && !metadata?.summary && !metadata?.todos?.length && !metadata?.links?.length && (
          <p className="text-sm text-muted-foreground italic">
            No additional details available for this node.
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(DetailPanel);
