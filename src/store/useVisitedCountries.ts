import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY_V2 = "visited_countries_v2";
const STORAGE_KEY_LEGACY = "visited_countries";

// v2 format: Record<alpha3, unix timestamp ms>
type VisitedDates = Record<string, number>;

function loadVisitedDates(): VisitedDates {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) {
      return JSON.parse(raw) as VisitedDates;
    }
    // Migrate from legacy format (plain string[]) — timestamp 0 represents an
    // unknown/legacy visit date.
    const legacy = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (legacy) {
      const arr = JSON.parse(legacy) as string[];
      const migrated: VisitedDates = {};
      for (const code of arr) {
        migrated[code] = 0;
      }
      return migrated;
    }
  } catch {
    // ignore
  }
  return {};
}

function saveVisitedDates(dates: VisitedDates): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(dates));
  } catch {
    // ignore
  }
}

export function useVisitedCountries() {
  const [visitedDates, setVisitedDates] = useState<VisitedDates>(() => loadVisitedDates());

  const visited = useMemo(() => new Set(Object.keys(visitedDates)), [visitedDates]);

  useEffect(() => {
    saveVisitedDates(visitedDates);
  }, [visitedDates]);

  const toggle = useCallback((code: string) => {
    setVisitedDates((prev) => {
      const next = { ...prev };
      if (code in next) {
        delete next[code];
      } else {
        next[code] = Date.now();
      }
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (code: string) => code in visitedDates,
    [visitedDates]
  );

  return { visited, visitedDates, toggle, isVisited };
}
