"use client";

import { useEffect, useState } from "react";
import { fetchDiagramList } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { getProgressColor } from "@/lib/progressUtils";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface DiagramMeta {
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  progress?: number;  // Optional progress percentage from API
}

interface SidebarProps {
  selectedSlug: string | null;
  onSelectDiagram: (slug: string) => void;
}

export default function Sidebar({ selectedSlug, onSelectDiagram }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [diagrams, setDiagrams] = useState<DiagramMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiagramList()
      .then((data) => {
        setCategories(data.categories || []);
        setDiagrams(data.diagrams || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <aside className="w-64 border-r border-border bg-card/50 p-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 border-r border-border bg-card/50 p-4">
        <div className="text-sm text-red-500">Error: {error}</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card/50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Diagrams</h1>
          <ThemeToggle />
        </div>
        {categories.map((category) => {
          const categoryDiagrams = diagrams.filter((d) => d.category === category.id);
          if (categoryDiagrams.length === 0) return null;

          return (
            <div key={category.id} className="mb-4">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {category.icon} {category.label}
              </h2>
              <ul className="space-y-1">
                {categoryDiagrams.map((diagram) => (
                  <li key={diagram.slug}>
                    <button
                      onClick={() => onSelectDiagram(diagram.slug)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedSlug === diagram.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span>{diagram.icon}</span>
                        <span className="flex-1">{diagram.title}</span>
                        {diagram.progress !== undefined && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${getProgressColor(diagram.progress)}20`,
                              color: getProgressColor(diagram.progress),
                            }}
                          >
                            {diagram.progress}%
                          </span>
                        )}
                      </div>
                      {diagram.progress !== undefined && (
                        <div className="mt-1 h-1 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${diagram.progress}%`,
                              backgroundColor: getProgressColor(diagram.progress),
                            }}
                          />
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
