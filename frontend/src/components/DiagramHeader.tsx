"use client";

import { memo } from "react";
import type { ProgressStats } from "@/lib/types";
import { getProgressColor, getProgressLabel } from "@/lib/progressUtils";

interface DiagramHeaderProps {
  title?: string;
  description?: string;
  progress: ProgressStats;
}

function DiagramHeader({ title, description, progress }: DiagramHeaderProps) {
  const progressColor = getProgressColor(progress.completedPercentage);
  const progressLabel = getProgressLabel(progress);

  return (
    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm max-w-sm">
      {/* Title */}
      {title && <h2 className="text-sm font-semibold mb-1">{title}</h2>}
      {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress.completedPercentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress.completedPercentage}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{progressLabel}</p>
      </div>

      {/* Status breakdown */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {progress.tested > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-[var(--status-tested)]/20 text-[var(--status-tested)]">
            {progress.tested} tested
          </span>
        )}
        {progress.implemented > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-[var(--status-implemented)]/20 text-[var(--status-implemented)]">
            {progress.implemented} impl
          </span>
        )}
        {progress.in_progress > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-[var(--status-in-progress)]/20 text-[var(--status-in-progress)]">
            {progress.in_progress} WIP
          </span>
        )}
        {progress.blocked > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-[var(--status-blocked)]/20 text-[var(--status-blocked)]">
            {progress.blocked} blocked
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(DiagramHeader);
