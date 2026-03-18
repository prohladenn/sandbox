import { useEffect } from "react";
import { COUNTRIES } from "../data/countries";

interface CountryToastProps {
  alpha3: string;
  isVisited: boolean;
  onClose: () => void;
  onToggle: () => void;
  themeColor: string;
  textColor: string;
  bgColor: string;
}

// Height of the bottom tab bar (padding: 10px top + ~24px icon + 2px gap + ~14px label + 10px bottom)
const TAB_BAR_HEIGHT = 74;

export function CountryToast({
  alpha3,
  isVisited,
  onClose,
  onToggle,
  themeColor,
  textColor,
  bgColor,
}: CountryToastProps) {
  const country = COUNTRIES.find((c) => c.code === alpha3);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [alpha3, onClose]);

  if (!country) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: `calc(env(safe-area-inset-bottom, 0px) + ${TAB_BAR_HEIGHT}px)`,
        left: "50%",
        transform: "translateX(-50%)",
        background: bgColor,
        borderRadius: 16,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        zIndex: 1000,
        minWidth: 260,
        maxWidth: "90vw",
        animation: "slideUp 0.25s ease",
      }}
    >
      <span style={{ fontSize: 28 }}>{country.flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: textColor }}>
          {country.name}
        </div>
        <div style={{ fontSize: 12, color: textColor, opacity: 0.55 }}>
          {country.region}
        </div>
      </div>
      <button
        onClick={() => {
          onToggle();
          onClose();
        }}
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          border: "none",
          background: isVisited ? `${themeColor}22` : themeColor,
          color: isVisited ? themeColor : "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {isVisited ? "Remove" : "Add"}
      </button>
    </div>
  );
}
