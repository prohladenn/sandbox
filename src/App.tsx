import { useState, useCallback } from "react";
import "./App.css";
import { WorldMap } from "./components/WorldMap";
import { Statistics } from "./components/Statistics";
import { CountrySearch } from "./components/CountrySearch";
import { CountryToast } from "./components/CountryToast";
import { useVisitedCountries } from "./store/useVisitedCountries";
import { useTelegramTheme } from "./hooks/useTelegramTheme";

type Tab = "map" | "list" | "stats";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [toast, setToast] = useState<{ alpha3: string; name: string } | null>(null);
  const { visited, toggle, isVisited } = useVisitedCountries();
  const theme = useTelegramTheme();

  const handleMapClick = useCallback((alpha3: string, name: string) => {
    setToast({ alpha3, name });
  }, []);

  const handleToastToggle = useCallback(() => {
    if (toast) toggle(toast.alpha3);
  }, [toast, toggle]);

  const handleToastClose = useCallback(() => setToast(null), []);

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    flex: 1,
    padding: "10px 0",
    border: "none",
    background: "transparent",
    color: activeTab === tab ? theme.accent : theme.hint,
    fontSize: 13,
    fontWeight: activeTab === tab ? 600 : 400,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    transition: "color 0.15s",
  });

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 8px",
          background: theme.header,
          borderBottom: `1px solid ${theme.separator}`,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.text }}>
          🌍 Country Tracker
        </h1>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: theme.hint }}>
          {visited.size} countries visited
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: activeTab === "map" ? "hidden" : "auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
        {activeTab === "map" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
              <WorldMap
                visitedCodes={visited}
                onCountryClick={handleMapClick}
                visitedColor={theme.accent}
                defaultColor={theme.mapDefault}
                strokeColor={theme.mapStroke}
                hoverColor={theme.mapHover}
              />
            </div>
            <div style={{ padding: "8px 12px", fontSize: 12, color: theme.hint, textAlign: "center", flexShrink: 0 }}>
              Tap a country to add or remove it • Pinch/scroll to zoom
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <CountrySearch
            visited={visited}
            onToggle={toggle}
            themeColor={theme.accent}
            textColor={theme.text}
            cardBg={theme.card}
            inputBg={theme.input}
          />
        )}

        {activeTab === "stats" && (
          <Statistics
            visited={visited}
            themeColor={theme.accent}
            textColor={theme.text}
            cardBg={theme.card}
          />
        )}
      </div>

      {/* Bottom tab bar */}
      <div
        style={{
          display: "flex",
          background: theme.header,
          borderTop: `1px solid ${theme.separator}`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <button style={tabStyle("map")} onClick={() => setActiveTab("map")}>
          <span style={{ fontSize: 20 }}>🗺️</span>
          <span>Map</span>
        </button>
        <button style={tabStyle("list")} onClick={() => setActiveTab("list")}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <span>Countries</span>
        </button>
        <button style={tabStyle("stats")} onClick={() => setActiveTab("stats")}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span>Stats</span>
        </button>
      </div>

      {/* Country toast popup on map click */}
      {toast && (
        <CountryToast
          alpha3={toast.alpha3}
          isVisited={isVisited(toast.alpha3)}
          onClose={handleToastClose}
          onToggle={handleToastToggle}
          themeColor={theme.accent}
          textColor={theme.text}
          bgColor={theme.card}
        />
      )}
    </div>
  );
}

export default App;
