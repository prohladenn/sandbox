import { useMemo } from "react";

interface TelegramTheme {
  bg: string;
  text: string;
  hint: string;
  accent: string;
  card: string;
  header: string;
  separator: string;
  input: string;
  mapDefault: string;
  mapHover: string;
  mapStroke: string;
  mapSelected: string;
}

function getTelegramWebApp() {
  return (window as unknown as { Telegram?: { WebApp?: Record<string, unknown> } }).Telegram?.WebApp;
}

function getTgColor(key: string, fallback: string): string {
  const tg = getTelegramWebApp();
  if (!tg) return fallback;
  const themeParams = tg.themeParams as Record<string, string> | undefined;
  return themeParams?.[key] ?? fallback;
}

function isDark(): boolean {
  const tg = getTelegramWebApp();
  if (!tg) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return (tg.colorScheme as string) === "dark";
}

export function useTelegramTheme(): TelegramTheme {
  return useMemo(() => {
    const dark = isDark();

    if (dark) {
      return {
        bg: getTgColor("bg_color", "#1c1c1e"),
        text: getTgColor("text_color", "#ffffff"),
        hint: getTgColor("hint_color", "#8e8e93"),
        accent: getTgColor("button_color", "#2196f3"),
        card: getTgColor("secondary_bg_color", "#2c2c2e"),
        header: getTgColor("header_bg_color", "#1c1c1e"),
        separator: getTgColor("section_separator_color", "#38383a"),
        input: getTgColor("secondary_bg_color", "#2c2c2e"),
        mapDefault: "#3a3a3c",
        mapHover: "#48484a",
        mapStroke: "#1c1c1e",
        mapSelected: "#4a7bb5",
      };
    }

    return {
      bg: getTgColor("bg_color", "#f2f2f7"),
      text: getTgColor("text_color", "#000000"),
      hint: getTgColor("hint_color", "#8e8e93"),
      accent: getTgColor("button_color", "#007aff"),
      card: getTgColor("secondary_bg_color", "#ffffff"),
      header: getTgColor("header_bg_color", "#ffffff"),
      separator: getTgColor("section_separator_color", "#c6c6c8"),
      input: getTgColor("secondary_bg_color", "#e5e5ea"),
      mapDefault: "#d1d1d6",
      mapHover: "#c7c7cc",
      mapStroke: "#f2f2f7",
      mapSelected: "#a8c4e0",
    };
  }, []);
}
