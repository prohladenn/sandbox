import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY_V3 = "visited_countries_v3";
const STORAGE_KEY_V2 = "visited_countries_v2";
const STORAGE_KEY_LEGACY = "visited_countries";

export interface VisitEntry {
  startDate: string; // ISO date "YYYY-MM-DD", empty string = unknown
  endDate?: string;  // ISO date "YYYY-MM-DD", optional
}

export type VisitedData = Record<string, VisitEntry>;

function tsToDateStr(ts: number): string {
  if (ts === 0) return "";
  return new Date(ts).toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadVisitedData(): VisitedData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (raw) {
      return JSON.parse(raw) as VisitedData;
    }
    // Migrate from v2 format (Record<alpha3, unix timestamp ms>)
    const v2raw = localStorage.getItem(STORAGE_KEY_V2);
    if (v2raw) {
      const v2 = JSON.parse(v2raw) as Record<string, number>;
      const migrated: VisitedData = {};
      for (const [code, ts] of Object.entries(v2)) {
        migrated[code] = { startDate: tsToDateStr(ts) };
      }
      return migrated;
    }
    // Migrate from legacy format (plain string[])
    const legacy = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (legacy) {
      const arr = JSON.parse(legacy) as string[];
      const migrated: VisitedData = {};
      for (const code of arr) {
        migrated[code] = { startDate: "" };
      }
      return migrated;
    }
  } catch {
    // ignore
  }
  return {};
}

function saveVisitedData(data: VisitedData): void {
  try {
    localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useVisitedCountries() {
  const [visitedData, setVisitedData] = useState<VisitedData>(() => loadVisitedData());

  const visited = useMemo(() => new Set(Object.keys(visitedData)), [visitedData]);

  useEffect(() => {
    saveVisitedData(visitedData);
  }, [visitedData]);

  const markVisited = useCallback((code: string, startDate: string, endDate?: string) => {
    setVisitedData((prev) => ({
      ...prev,
      [code]: { startDate, ...(endDate ? { endDate } : {}) },
    }));
  }, []);

  const unvisit = useCallback((code: string) => {
    setVisitedData((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }, []);

  // Convenience toggle: unvisits if visited, marks with today's date if not
  const toggle = useCallback((code: string) => {
    setVisitedData((prev) => {
      const next = { ...prev };
      if (code in next) {
        delete next[code];
      } else {
        next[code] = { startDate: todayStr() };
      }
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (code: string) => code in visitedData,
    [visitedData]
  );

  return { visited, visitedData, markVisited, unvisit, toggle, isVisited };
}
