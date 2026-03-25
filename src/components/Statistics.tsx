import { useMemo } from "react";
import { COUNTRIES, REGIONS, TOTAL_COUNTRIES } from "../data/countries";
import type { VisitedData } from "../store/useVisitedCountries";

interface Rank {
  emoji: string;
  name: string;
  min: number;
  max: number;
}

const RANKS: Rank[] = [
  { emoji: "🏠", name: "Homebody",           min: 0,   max: 0   },
  { emoji: "🚶", name: "Newcomer",           min: 1,   max: 4   },
  { emoji: "🧭", name: "Explorer",           min: 5,   max: 14  },
  { emoji: "✈️", name: "Adventurer",         min: 15,  max: 29  },
  { emoji: "🌍", name: "Traveler",           min: 30,  max: 49  },
  { emoji: "🗺️", name: "Globetrotter",       min: 50,  max: 74  },
  { emoji: "🌐", name: "World Traveler",     min: 75,  max: 99  },
  { emoji: "⭐", name: "Seasoned Nomad",     min: 100, max: 149 },
  { emoji: "🏆", name: "Legendary Explorer", min: 150, max: 195 },
];

const HALFWAY_THRESHOLD = Math.ceil(TOTAL_COUNTRIES / 2);

function getRank(total: number): { rank: Rank; nextThreshold: number; progress: number } {
  let rank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (total >= RANKS[i].min) {
      rank = RANKS[i];
      break;
    }
  }
  const idx = RANKS.indexOf(rank);
  const nextRank = RANKS[idx + 1];
  if (!nextRank) {
    return { rank, nextThreshold: TOTAL_COUNTRIES, progress: 1 };
  }
  const rangeSize = nextRank.min - rank.min;
  const progress = Math.min((total - rank.min) / rangeSize, 1);
  return { rank, nextThreshold: nextRank.min, progress };
}

interface Achievement {
  emoji: string;
  name: string;
  description: string;
  unlocked: boolean;
}

function getAchievements(
  total: number,
  byRegion: { region: string; count: number; total: number }[],
  uniqueYears: number,
  uniqueRegions: number
): Achievement[] {
  const completedRegions = byRegion.filter((r) => r.count === r.total);
  return [
    {
      emoji: "🚀",
      name: "First Step",
      description: "Visit your first country",
      unlocked: total >= 1,
    },
    {
      emoji: "🧳",
      name: "Wanderer",
      description: "Visit 10 countries",
      unlocked: total >= 10,
    },
    {
      emoji: "🌎",
      name: "Continent Hopper",
      description: "Visit countries in 3 different regions",
      unlocked: uniqueRegions >= 3,
    },
    {
      emoji: "⚡",
      name: "Halfway There",
      description: `Visit ${HALFWAY_THRESHOLD} countries (50% of the world)`,
      unlocked: total >= HALFWAY_THRESHOLD,
    },
    {
      emoji: "📅",
      name: "Jet Setter",
      description: "Record visits across 3+ different years",
      unlocked: uniqueYears >= 3,
    },
    {
      emoji: "🌍",
      name: "Globetrotter",
      description: "Visit 50 countries",
      unlocked: total >= 50,
    },
    {
      emoji: "🥇",
      name: "Regional Champion",
      description: "Complete all countries in any region",
      unlocked: completedRegions.length >= 1,
    },
    {
      emoji: "🌐",
      name: "World Traveler",
      description: "Visit 100 countries",
      unlocked: total >= 100,
    },
    {
      emoji: "🏆",
      name: "Legendary Explorer",
      description: "Visit all 195 countries",
      unlocked: total >= TOTAL_COUNTRIES,
    },
  ];
}

interface StatisticsProps {
  visited: Set<string>;
  visitedData: VisitedData;
  themeColor: string;
  textColor: string;
  cardBg: string;
}

export function Statistics({ visited, visitedData, themeColor, textColor, cardBg }: StatisticsProps) {
  const stats = useMemo(() => {
    const visitedList = COUNTRIES.filter((c) => visited.has(c.code));
    const byRegion = REGIONS.map((region) => {
      const total = COUNTRIES.filter((c) => c.region === region).length;
      const count = visitedList.filter((c) => c.region === region).length;
      return { region, count, total };
    }).filter((r) => r.total > 0);

    // Yearly breakdown: count countries by startDate year
    const yearMap = new Map<string, number>();
    for (const entry of Object.values(visitedData)) {
      const year = entry.startDate ? entry.startDate.slice(0, 4) : null;
      if (!year) continue;
      yearMap.set(year, (yearMap.get(year) ?? 0) + 1);
    }
    const byYear = [...yearMap.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([year, count]) => ({ year, count }));

    const uniqueYears = yearMap.size;
    const uniqueRegions = byRegion.filter((r) => r.count > 0).length;

    const total = visited.size;
    const { rank, nextThreshold, progress } = getRank(total);
    const achievements = getAchievements(total, byRegion, uniqueYears, uniqueRegions);

    return {
      total,
      percentage: ((total / TOTAL_COUNTRIES) * 100).toFixed(1),
      byRegion,
      byYear,
      rank,
      nextThreshold,
      rankProgress: progress,
      achievements,
    };
  }, [visited, visitedData]);

  const cardStyle: React.CSSProperties = {
    background: cardBg,
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 8,
  };

  return (
    <div style={{ padding: "12px 12px 12px", flexShrink: 0 }}>
      {/* Rank card */}
      <div
        style={{
          ...cardStyle,
          marginBottom: 16,
          background: `linear-gradient(135deg, ${themeColor}22 0%, ${themeColor}08 100%)`,
          border: `1px solid ${themeColor}33`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 40, lineHeight: 1 }}>{stats.rank.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: textColor }}>
              {stats.rank.name}
            </div>
            {stats.rank.max < TOTAL_COUNTRIES ? (
              <div style={{ fontSize: 12, color: textColor, opacity: 0.55, marginTop: 1 }}>
                {stats.nextThreshold - stats.total} more to reach next rank
              </div>
            ) : (
              <div style={{ fontSize: 12, color: themeColor, marginTop: 1, fontWeight: 600 }}>
                Maximum rank achieved! 🎉
              </div>
            )}
          </div>
        </div>
        {stats.rank.max < TOTAL_COUNTRIES && (
          <div
            style={{
              height: 5,
              background: `${textColor}18`,
              borderRadius: 3,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${stats.rankProgress * 100}%`,
                background: themeColor,
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        )}
      </div>

      {/* Summary numbers */}
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

      {stats.byYear.length > 0 && (
        <>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textColor,
              marginBottom: 8,
              marginTop: 16,
              opacity: 0.7,
            }}
          >
            BY YEAR
          </div>
          {stats.byYear.map(({ year, count }) => (
            <div key={year} style={{ ...cardStyle, marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: textColor }}>{year}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: themeColor }}>
                  {count} {count === 1 ? "country" : "countries"}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Achievements */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: textColor,
          marginBottom: 8,
          marginTop: 16,
          opacity: 0.7,
        }}
      >
        ACHIEVEMENTS
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {stats.achievements.map((a) => (
          <div
            key={a.name}
            title={a.description}
            style={{
              background: a.unlocked ? `${themeColor}18` : `${textColor}08`,
              border: `1px solid ${a.unlocked ? themeColor + "44" : textColor + "14"}`,
              borderRadius: 12,
              padding: "10px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: a.unlocked ? 1 : 0.45,
              filter: a.unlocked ? "none" : "grayscale(1)",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 26 }}>{a.emoji}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: a.unlocked ? themeColor : textColor,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {a.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
