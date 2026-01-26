"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DiagramViewer from "@/components/DiagramViewer";

export default function Home() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar selectedSlug={selectedSlug} onSelectDiagram={setSelectedSlug} />
      <main className="flex-1 bg-background">
        {selectedSlug ? (
          <DiagramViewer slug={selectedSlug} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a diagram from the sidebar
          </div>
        )}
      </main>
    </div>
  );
}
