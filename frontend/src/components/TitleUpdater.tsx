import type { RouteHandle } from "@/constants/routes";
import React from "react";
import { useMatches, type UIMatch } from "react-router";

export function TitleUpdater() {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
  const current = [...matches].reverse().find((m) => (m.handle as any)?.title);
  const title = (current?.handle as any)?.title;

  React.useEffect(() => {
    document.title = title ? `NTAY | ${title}` : "NTAY";
  }, [title]);

  return null;
}
