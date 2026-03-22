import { useState } from "react";
import { COUNTRIES } from "../data/countries";
import type { VisitEntry } from "../store/useVisitedCountries";
import { todayStr } from "../utils/dates";

interface VisitDateModalProps {
  alpha3: string;
  existingEntry?: VisitEntry;
  onConfirm: (startDate: string, endDate?: string) => void;
  onCancel: () => void;
  themeColor: string;
  textColor: string;
  bgColor: string;
  cardBg: string;
  hintColor: string;
  inputBg: string;
}

export function VisitDateModal({
  alpha3,
  existingEntry,
  onConfirm,
  onCancel,
  themeColor,
  textColor,
  bgColor,
  cardBg,
  hintColor,
  inputBg,
}: VisitDateModalProps) {
  const country = COUNTRIES.find((c) => c.code === alpha3);
  const [startDate, setStartDate] = useState(existingEntry?.startDate || todayStr());
  const [endDate, setEndDate] = useState(existingEntry?.endDate || "");

  if (!country) return null;

  const handleConfirm = () => {
    if (!startDate) return;
    onConfirm(startDate, endDate || undefined);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${textColor}22`,
    background: inputBg,
    color: textColor,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: hintColor,
    marginBottom: 6,
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bgColor,
          borderRadius: "16px 16px 0 0",
          padding: "16px 20px 32px",
          width: "100%",
          maxWidth: 600,
          boxSizing: "border-box",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            background: `${textColor}33`,
            borderRadius: 2,
            margin: "0 auto 16px",
          }}
        />

        {/* Country header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 36 }}>{country.flag}</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: textColor }}>
              {country.name}
            </div>
            <div style={{ fontSize: 13, color: hintColor }}>{country.region}</div>
          </div>
        </div>

        {/* Start date */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Start date (arrival)</label>
          <input
            type="date"
            value={startDate}
            max={todayStr()}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* End date */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>End date (departure) — optional</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            max={todayStr()}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              border: `1px solid ${textColor}22`,
              background: cardBg,
              color: textColor,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!startDate}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: startDate ? themeColor : `${themeColor}66`,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: startDate ? "pointer" : "default",
            }}
          >
            Save Visit
          </button>
        </div>
      </div>
    </div>
  );
}

