import { useState, useMemo } from "react";
import { COUNTRIES, REGIONS } from "../data/countries";
import type { Country } from "../data/countries";

interface CountrySearchProps {
  visited: Set<string>;
  onToggle: (code: string) => void;
  themeColor: string;
  textColor: string;
  cardBg: string;
  inputBg: string;
}

export function CountrySearch({
  visited,
  onToggle,
  themeColor,
  textColor,
  cardBg,
  inputBg,
}: CountrySearchProps) {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [showVisited, setShowVisited] = useState<"all" | "visited" | "unvisited">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COUNTRIES.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (regionFilter !== "All" && c.region !== regionFilter) return false;
      if (showVisited === "visited" && !visited.has(c.code)) return false;
      if (showVisited === "unvisited" && visited.has(c.code)) return false;
      return true;
    });
  }, [search, regionFilter, showVisited, visited]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: inputBg,
    color: textColor,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: 20,
    border: "none",
    background: active ? themeColor : inputBg,
    color: active ? "#fff" : textColor,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
  });

  const renderCountry = (country: Country) => {
    const isVisited = visited.has(country.code);
    return (
      <div
        key={country.code}
        onClick={() => onToggle(country.code)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          background: cardBg,
          borderRadius: 10,
          marginBottom: 4,
          cursor: "pointer",
          userSelect: "none",
          transition: "opacity 0.15s",
        }}
      >
        <span style={{ fontSize: 22, marginRight: 10 }}>{country.flag}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, color: textColor, fontWeight: 500 }}>
            {country.name}
          </div>
          <div style={{ fontSize: 12, color: textColor, opacity: 0.5 }}>
            {country.region}
          </div>
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            background: isVisited ? themeColor : "transparent",
            border: `2px solid ${isVisited ? themeColor : `${textColor}44`}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          {isVisited && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "12px 12px 12px", flexShrink: 0 }}>
      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "10px 0",
          scrollbarWidth: "none",
        }}
      >
        <button style={chipStyle(showVisited === "all")} onClick={() => setShowVisited("all")}>
          All
        </button>
        <button
          style={chipStyle(showVisited === "visited")}
          onClick={() => setShowVisited("visited")}
        >
          ✓ Visited
        </button>
        <button
          style={chipStyle(showVisited === "unvisited")}
          onClick={() => setShowVisited("unvisited")}
        >
          ○ Unvisited
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 10,
          scrollbarWidth: "none",
        }}
      >
        <button
          style={chipStyle(regionFilter === "All")}
          onClick={() => setRegionFilter("All")}
        >
          🌍 All Regions
        </button>
        {REGIONS.map((r) => (
          <button key={r} style={chipStyle(regionFilter === r)} onClick={() => setRegionFilter(r)}>
            {r}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: textColor, opacity: 0.5, marginBottom: 8 }}>
        {filtered.length} countries
      </div>

      <div>
        {filtered.map(renderCountry)}
      </div>
    </div>
  );
}
