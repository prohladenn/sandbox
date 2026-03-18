import { useMemo } from "react";
import { COUNTRIES, REGIONS, TOTAL_COUNTRIES } from "../data/countries";

interface StatisticsProps {
  visited: Set<string>;
  themeColor: string;
  textColor: string;
  cardBg: string;
}

export function Statistics({ visited, themeColor, textColor, cardBg }: StatisticsProps) {
  const stats = useMemo(() => {
    const visitedList = COUNTRIES.filter((c) => visited.has(c.code));
    const byRegion = REGIONS.map((region) => {
      const total = COUNTRIES.filter((c) => c.region === region).length;
      const count = visitedList.filter((c) => c.region === region).length;
      return { region, count, total };
    }).filter((r) => r.total > 0);

    return {
      total: visited.size,
      percentage: ((visited.size / TOTAL_COUNTRIES) * 100).toFixed(1),
      byRegion,
    };
  }, [visited]);

  const cardStyle: React.CSSProperties = {
    background: cardBg,
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 8,
  };

  return (
    <div style={{ padding: "0 12px 12px" }}>
      <div
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{ fontSize: 32, fontWeight: 700, color: themeColor, lineHeight: 1.1 }}
          >
            {stats.total}
          </div>
          <div style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>
            countries visited
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 48,
            background: textColor,
            opacity: 0.15,
            margin: "0 12px",
          }}
        />
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{ fontSize: 32, fontWeight: 700, color: themeColor, lineHeight: 1.1 }}
          >
            {stats.percentage}%
          </div>
          <div style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>
            of the world
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 48,
            background: textColor,
            opacity: 0.15,
            margin: "0 12px",
          }}
        />
        <div style={{ textAlign: "center", flex: 1 }}>
          <div
            style={{ fontSize: 32, fontWeight: 700, color: themeColor, lineHeight: 1.1 }}
          >
            {TOTAL_COUNTRIES - stats.total}
          </div>
          <div style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>
            yet to visit
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 8, opacity: 0.7 }}>
        BY REGION
      </div>
      {stats.byRegion.map(({ region, count, total }) => (
        <div key={region} style={{ ...cardStyle, marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 14, color: textColor }}>{region}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: themeColor }}>
              {count}/{total}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: `${textColor}22`,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(count / total) * 100}%`,
                background: themeColor,
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
