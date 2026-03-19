import { COUNTRIES } from "../data/countries";

interface CountryCardProps {
  alpha3: string;
  isVisited: boolean;
  onToggle: (alpha3: string) => void;
  themeColor: string;
  textColor: string;
  bgColor: string;
  hintColor: string;
}

export function CountryCard({
  alpha3,
  isVisited,
  onToggle,
  themeColor,
  textColor,
  bgColor,
  hintColor,
}: CountryCardProps) {
  const country = COUNTRIES.find((c) => c.code === alpha3);

  if (!country) return null;

  return (
    <div
      style={{
        margin: "8px 12px",
        background: bgColor,
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}
    >
      <span style={{ fontSize: 36 }}>{country.flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>
          {country.name}
        </div>
        <div style={{ fontSize: 12, color: hintColor, marginTop: 2 }}>
          {country.region}
        </div>
      </div>
      <button
        onClick={() => onToggle(alpha3)}
        aria-label={isVisited ? "Mark as not visited" : "Mark as visited"}
        style={{
          padding: "8px 16px",
          borderRadius: 20,
          border: "none",
          background: isVisited ? `${themeColor}22` : themeColor,
          color: isVisited ? themeColor : "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {isVisited ? "Visited ✓" : "Mark Visited"}
      </button>
    </div>
  );
}
