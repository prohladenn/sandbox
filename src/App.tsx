import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { WorldMap } from "./components/WorldMap";
import { Statistics } from "./components/Statistics";
import { CountrySearch } from "./components/CountrySearch";
import { CountryCard } from "./components/CountryCard";
import { useVisitedCountries } from "./store/useVisitedCountries";
import { useTelegramTheme } from "./hooks/useTelegramTheme";
import { COUNTRIES } from "./data/countries";
import {
  showBackButton,
  hideBackButton,
  onBackButtonClick,
  hapticFeedbackImpactOccurred,
  hapticFeedbackSelectionChanged,
} from "@telegram-apps/sdk-react";

type Tab = "map" | "list" | "stats";

function randomCountryCode(): string {
  if (COUNTRIES.length === 0) return "";
  return COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)].code;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [selectedCountry, setSelectedCountry] = useState<string>(() => randomCountryCode());
  const { visited, toggle, isVisited } = useVisitedCountries();
  const theme = useTelegramTheme();

  const handleMapClick = useCallback((alpha3: string) => {
    setSelectedCountry(alpha3);
    if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("light");
  }, []);

  const handleToggle = useCallback((alpha3: string) => {
    toggle(alpha3);
    if (hapticFeedbackImpactOccurred.isAvailable()) hapticFeedbackImpactOccurred("medium");
  }, [toggle]);

  const handleTabChange = useCallback((tab: Tab) => {
    if (hapticFeedbackSelectionChanged.isAvailable()) hapticFeedbackSelectionChanged();
    setActiveTab(tab);
  }, []);

  // Show the Telegram back button on list/stats tabs; hide it on the map tab
  useEffect(() => {
    if (activeTab === "map") {
      if (hideBackButton.isAvailable()) hideBackButton();
      return;
    }
    if (showBackButton.isAvailable()) showBackButton();
    let offClick: VoidFunction | undefined;
    if (onBackButtonClick.isAvailable()) {
      offClick = onBackButtonClick(() => setActiveTab("map"));
    }
    return () => {
      offClick?.();
    };
  }, [activeTab]);

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
          <div style={{ flex: 1, overflow: "hidden" }}>
            <WorldMap
              visitedCodes={visited}
              selectedCountry={selectedCountry}
              onCountryClick={handleMapClick}
              visitedColor={theme.accent}
              defaultColor={theme.mapDefault}
              strokeColor={theme.mapStroke}
              selectedColor={theme.mapSelected}
            />
          </div>
        )}

        {activeTab === "list" && (
          <CountrySearch
            visited={visited}
            onToggle={handleToggle}
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

      {/* Hint text pinned just above country card */}
      {activeTab === "map" && (
        <div style={{ padding: "4px 12px 8px", fontSize: 12, color: theme.hint, textAlign: "center" }}>
          Tap a country to add or remove it • Pinch/scroll to zoom
        </div>
      )}

      {/* Country card pinned above bottom tab bar */}
      {activeTab === "map" && (
        <CountryCard
          alpha3={selectedCountry}
          isVisited={isVisited(selectedCountry)}
          onToggle={handleToggle}
          themeColor={theme.accent}
          textColor={theme.text}
          bgColor={theme.card}
          hintColor={theme.hint}
        />
      )}

      {/* Bottom tab bar */}
      <div
        style={{
          display: "flex",
          background: theme.header,
          borderTop: `1px solid ${theme.separator}`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <button style={tabStyle("map")} onClick={() => handleTabChange("map")}>
          <span style={{ fontSize: 20 }}>🗺️</span>
          <span>Map</span>
        </button>
        <button style={tabStyle("list")} onClick={() => handleTabChange("list")}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <span>Countries</span>
        </button>
        <button style={tabStyle("stats")} onClick={() => handleTabChange("stats")}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span>Stats</span>
        </button>
      </div>
    </div>
  );
}

export default App;
