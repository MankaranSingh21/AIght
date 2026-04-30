"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PDFReportData } from "./QuizReportPDF";

// pdf() is browser-only — dynamically imported to avoid SSR
const generatePDF = async (data: PDFReportData): Promise<void> => {
  const { pdf } = await import("@react-pdf/renderer");
  const { default: QuizReportPDF } = await import("./QuizReportPDF");
  const blob = await pdf(<QuizReportPDF data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AIght-Report-${data.fieldName.replace(/\s+/g, "-")}.pdf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
};

export default function DownloadReportButton({ data }: { data: PDFReportData }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await generatePDF(data);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: done ? "var(--accent-primary)" : loading ? "var(--text-muted)" : "var(--text-primary)",
        background: done ? "var(--accent-primary-glow)" : "var(--bg-elevated)",
        border: `1px solid ${done ? "var(--border-emphasis)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        padding: "10px 20px",
        cursor: loading ? "wait" : "pointer",
        transition: "all 150ms ease",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: "spin 1s linear infinite" }}>
            <circle cx="8" cy="8" r="6" strokeDasharray="28" strokeDashoffset="10" />
          </svg>
          Generating…
        </>
      ) : done ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Downloaded
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 13h12" strokeLinecap="round" />
          </svg>
          Download Report
        </>
      )}
    </button>
  );
}
