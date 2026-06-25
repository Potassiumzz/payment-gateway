import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/Input";

const PAGINATION = {
  SIMPLE_THRESHOLD: 7,   // show all pages below this count
  ELLIPSIS_START_AFTER: 4,  // show start ellipsis when page > this
  ELLIPSIS_END_BEFORE: 3,   // show end ellipsis when page < totalPages - this
  WINDOW: 1,             // pages shown on each side of current page
};

export function PaginationBar({ page, totalPages, onPageChange }: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [showInput, setShowInput] = React.useState<"start" | "end" | null>(null);

  function handleEllipsisClick(position: "start" | "end") {
    setShowInput(position);
    setInputValue("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const p = parseInt(inputValue);
      if (!isNaN(p) && p >= 1 && p <= totalPages) onPageChange(p);
      setShowInput(null);
    }
    if (e.key === "Escape") setShowInput(null);
  }

  function getPages(): (number | "ellipsis-start" | "ellipsis-end")[] {
    if (totalPages <= PAGINATION.SIMPLE_THRESHOLD) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

    if (page > PAGINATION.ELLIPSIS_START_AFTER) pages.push("ellipsis-start");
    
    const start = Math.max(2, page - PAGINATION.WINDOW);
    const end = Math.min(totalPages - 1, page + PAGINATION.WINDOW);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - PAGINATION.ELLIPSIS_END_BEFORE) pages.push("ellipsis-end");
    pages.push(totalPages);

    return pages;
  }

  const ellipsisInput = (position: "start" | "end") => (
    <Input
      key={`ellipses-input-${position}`}
      autoFocus
      type="number"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
      onBlur={() => setShowInput(null)}
      className="w-10 h-8 text-xs font-mono text-center rounded border border-primary bg-surface text-foreground outline-none [appearance:textfield]"
      min={1}
      max={totalPages}
    />
  );

  const pageBtn = (p: number) => (
    <button
      key={p}
      onClick={() => onPageChange(p)}
      className={cn(
        "w-8 h-8 text-xs font-mono rounded border transition-colors",
        p === page
          ? "border-primary text-primary bg-primary/10"
          : "border-border text-text-muted hover:border-primary/40 hover:text-foreground"
      )}
    >
      {p}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      {getPages().map((p) => {
        if (p === "ellipsis-start") {
          return showInput === "start"
            ? ellipsisInput("start")
            : (
              <button
                key="ellipsis-start"
                onClick={() => handleEllipsisClick("start")}
                className="w-8 h-8 text-xs font-mono text-text-muted hover:text-foreground rounded border border-transparent hover:border-border transition-colors"
              >
                …
              </button>
            );
        }
        if (p === "ellipsis-end") {
          return showInput === "end"
            ? ellipsisInput("end")
            : (
              <button
                key="ellipsis-end"
                onClick={() => handleEllipsisClick("end")}
                className="w-8 h-8 text-xs font-mono text-text-muted hover:text-foreground rounded border border-transparent hover:border-border transition-colors"
              >
                …
              </button>
            );
        }
        return pageBtn(p as number);
      })}
    </div>
  );
}
