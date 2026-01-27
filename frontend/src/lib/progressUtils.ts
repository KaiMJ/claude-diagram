// =============================================================================
// Progress Calculation Utilities
// =============================================================================

import type { YamlNode, YamlGroup, ProgressStats, NodeStatus } from "./types";

/**
 * Calculate progress statistics from nodes and groups.
 * Items without a status are counted as "not_started".
 */
export function calculateProgress(nodes: YamlNode[], groups: YamlGroup[]): ProgressStats {
  const allItems = [...nodes, ...groups];

  if (allItems.length === 0) {
    return {
      total: 0,
      not_started: 0,
      in_progress: 0,
      implemented: 0,
      tested: 0,
      blocked: 0,
      completedPercentage: 0,
    };
  }

  const counts: Record<NodeStatus, number> = {
    not_started: 0,
    in_progress: 0,
    implemented: 0,
    tested: 0,
    blocked: 0,
  };

  for (const item of allItems) {
    const status = item.status || "not_started";
    counts[status]++;
  }

  const completed = counts.implemented + counts.tested;
  const completedPercentage = Math.round((completed / allItems.length) * 100);

  return {
    total: allItems.length,
    ...counts,
    completedPercentage,
  };
}

/**
 * Get progress color based on percentage.
 * <30% = red, 30-70% = yellow, >70% = green
 */
export function getProgressColor(percentage: number): string {
  if (percentage < 30) return "var(--status-blocked)";
  if (percentage < 70) return "var(--status-in-progress)";
  return "var(--status-implemented)";
}

/**
 * Get progress label for display
 */
export function getProgressLabel(stats: ProgressStats): string {
  const parts: string[] = [];
  if (stats.tested > 0) parts.push(`${stats.tested} tested`);
  if (stats.implemented > 0) parts.push(`${stats.implemented} implemented`);
  if (stats.in_progress > 0) parts.push(`${stats.in_progress} in progress`);
  if (stats.blocked > 0) parts.push(`${stats.blocked} blocked`);
  return parts.join(", ") || "Not started";
}
