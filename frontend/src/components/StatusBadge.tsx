"use client";

import { memo } from "react";
import type { NodeStatus } from "@/lib/types";
import { getStatusStyle } from "@/lib/styles";
import { Circle, CircleDot, CircleCheck, CircleX, Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status?: NodeStatus;
  size?: "sm" | "md";
}

const statusIcons: Record<NodeStatus, React.ElementType> = {
  not_started: Circle,
  in_progress: Loader2,
  implemented: CircleDot,
  tested: CircleCheck,
  blocked: CircleX,
};

function StatusBadge({ status = "not_started", size = "sm" }: StatusBadgeProps) {
  const style = getStatusStyle(status);
  const Icon = statusIcons[status];
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center shadow-sm`}
      style={{
        backgroundColor: style.color,
        boxShadow: `0 0 0 2px var(--background), 0 1px 3px rgba(0,0,0,0.2)`,
      }}
      title={style.label}
    >
      <Icon
        size={iconSize}
        className={status === "in_progress" ? "animate-spin" : ""}
        style={{ color: "#fff" }}
      />
    </div>
  );
}

export default memo(StatusBadge);
