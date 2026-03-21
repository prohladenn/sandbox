import { useSignal } from "@telegram-apps/sdk-react";
import {
  isThemeParamsDark,
  isThemeParamsMounted,
  themeParamsState,
} from "@telegram-apps/sdk-react";

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

export function useTelegramTheme(): TelegramTheme {
  const mounted = useSignal(isThemeParamsMounted);
  const tgDark = useSignal(isThemeParamsDark);
  const state = useSignal(themeParamsState);

  const dark = mounted
    ? tgDark
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  const bg = state["bg_color"];
  const text = state["text_color"];
  const hint = state["hint_color"];
  const accent = state["button_color"];
  const secondaryBg = state["secondary_bg_color"];
  const headerBg = state["header_bg_color"];
  const separator = state["section_separator_color"];

  if (dark) {
    return {
      bg: bg ?? "#1c1c1e",
      text: text ?? "#ffffff",
      hint: hint ?? "#8e8e93",
      accent: accent ?? "#2196f3",
      card: secondaryBg ?? "#2c2c2e",
      header: headerBg ?? "#1c1c1e",
      separator: separator ?? "#38383a",
      input: secondaryBg ?? "#2c2c2e",
      mapDefault: "#3a3a3c",
      mapHover: "#48484a",
      mapStroke: bg ?? "#1c1c1e",
      mapSelected: "#4a7bb5",
    };
  }

  return {
    bg: bg ?? "#f2f2f7",
    text: text ?? "#000000",
    hint: hint ?? "#8e8e93",
    accent: accent ?? "#007aff",
    card: secondaryBg ?? "#ffffff",
    header: headerBg ?? "#ffffff",
    separator: separator ?? "#c6c6c8",
    input: secondaryBg ?? "#e5e5ea",
    mapDefault: "#d1d1d6",
    mapHover: "#c7c7cc",
    mapStroke: bg ?? "#f2f2f7",
    mapSelected: "#a8c4e0",
  };
}
