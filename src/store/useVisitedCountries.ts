import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "visited_countries";

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      return new Set(arr);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveVisited(visited: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
  } catch {
    // ignore
  }
}

export function useVisitedCountries() {
  const [visited, setVisited] = useState<Set<string>>(() => loadVisited());

  useEffect(() => {
    saveVisited(visited);
  }, [visited]);

  const toggle = useCallback((code: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (code: string) => visited.has(code),
    [visited]
  );

  return { visited, toggle, isVisited };
}
