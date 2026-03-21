import { useMemo } from "react";
import { COUNTRIES } from "../data/countries";
import type { VisitedData, VisitEntry } from "../store/useVisitedCountries";
import { formatVisitRange } from "../utils/dates";

interface TimelineEntry {
  code: string;
  visitEntry: VisitEntry;
}

interface TimelineProps {
  visitedData: VisitedData;
  onUnmark: (code: string) => void;
  onEditDates: (code: string) => void;
  themeColor: string;
  textColor: string;
  cardBg: string;
  hintColor: string;
}

function getEntryYear(entry: VisitEntry): string {
  if (!entry.startDate) return "Unknown";
  return entry.startDate.slice(0, 4);
}

export function Timeline({
  visitedData,
  onUnmark,
  onEditDates,
  themeColor,
  textColor,
  cardBg,
  hintColor,
}: TimelineProps) {
  const byYear = useMemo(() => {
    const entries: TimelineEntry[] = Object.entries(visitedData).map(
      ([code, visitEntry]) => ({ code, visitEntry })
    );

    const map = new Map<string, TimelineEntry[]>();
    for (const entry of entries) {
      const year = getEntryYear(entry.visitEntry);
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(entry);
    }

    // Sort entries within each year by startDate desc
    for (const group of map.values()) {
      group.sort((a, b) =>
        (b.visitEntry.startDate || "").localeCompare(a.visitEntry.startDate || "")
      );
    }

    // Sort years descending (Unknown last)
    return [...map.entries()].sort((a, b) => {
      if (a[0] === "Unknown") return 1;
      if (b[0] === "Unknown") return -1;
      return b[0].localeCompare(a[0]);
    });
  }, [visitedData]);

  const totalCount = Object.keys(visitedData).length;

  if (totalCount === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 48 }}>🗓️</span>
        <div style={{ fontSize: 17, fontWeight: 600, color: textColor }}>
          No visits yet
        </div>
        <div style={{ fontSize: 14, color: hintColor, textAlign: "center" }}>
          Mark countries as visited on the map or in the Countries list to see
          your travel history here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px", flexShrink: 0 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: textColor,
          opacity: 0.7,
          marginBottom: 10,
        }}
      >
        {totalCount} {totalCount === 1 ? "COUNTRY" : "COUNTRIES"} VISITED
      </div>

      {byYear.map(([year, entries]) => (
        <div key={year}>
          {/* Year header */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: themeColor,
              marginBottom: 6,
              marginTop: 10,
              paddingLeft: 2,
            }}
          >
            {year} · {entries.length} {entries.length === 1 ? "country" : "countries"}
          </div>

          {entries.map(({ code, visitEntry }) => {
            const country = COUNTRIES.find((c) => c.code === code);
            if (!country) return null;
            return (
              <div
                key={code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: cardBg,
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{country.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: textColor }}>
                    {country.name}
                  </div>
                  <div style={{ fontSize: 12, color: hintColor, marginTop: 2 }}>
                    {formatVisitRange(visitEntry)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => onEditDates(code)}
                    aria-label={`Edit dates for ${country.name}`}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 16,
                      border: "none",
                      background: `${themeColor}22`,
                      color: themeColor,
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onUnmark(code)}
                    aria-label={`Remove ${country.name} from visited`}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 16,
                      border: "none",
                      background: `${textColor}18`,
                      color: textColor,
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      opacity: 0.7,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
