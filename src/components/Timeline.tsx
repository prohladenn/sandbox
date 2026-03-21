import { useMemo } from "react";
import { COUNTRIES } from "../data/countries";

interface TimelineEntry {
  code: string;
  visitedAt: number;
}

interface TimelineProps {
  visitedDates: Record<string, number>;
  onUnmark: (code: string) => void;
  themeColor: string;
  textColor: string;
  cardBg: string;
  hintColor: string;
}

function formatDate(ts: number): string {
  if (ts === 0) return "Before app update";
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Timeline({
  visitedDates,
  onUnmark,
  themeColor,
  textColor,
  cardBg,
  hintColor,
}: TimelineProps) {
  const entries = useMemo<TimelineEntry[]>(() => {
    return Object.entries(visitedDates)
      .map(([code, visitedAt]) => ({ code, visitedAt }))
      .sort((a, b) => b.visitedAt - a.visitedAt);
  }, [visitedDates]);

  if (entries.length === 0) {
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
        {entries.length} {entries.length === 1 ? "COUNTRY" : "COUNTRIES"} VISITED
      </div>
      {entries.map(({ code, visitedAt }) => {
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
                {formatDate(visitedAt)}
              </div>
            </div>
            <button
              onClick={() => onUnmark(code)}
              aria-label={`Remove ${country.name} from visited`}
              style={{
                padding: "6px 12px",
                borderRadius: 16,
                border: "none",
                background: `${themeColor}22`,
                color: themeColor,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
