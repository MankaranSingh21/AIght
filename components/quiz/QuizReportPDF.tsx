import {
  Document, Page, Text, View, StyleSheet, Link,
} from "@react-pdf/renderer";

export type PDFReportData = {
  fieldName: string;
  roleTitle?: string;
  score: number;
  category: "low" | "medium" | "high";
  riskPct: number;
  augPct: number;
  growPct: number;
  breakdown: Record<string, number>;
  tools: Array<{ name: string; what_it_does: string }>;
  plan90: string[];
  vision1yr: string[];
  generatedAt: string;
};

const LIME = "#AAFF4D";
const DARK = "#0C0A08";
const OFF_WHITE = "#F5EFE0";
const MUTED = "rgba(245,239,224,0.45)";
const SURFACE = "#161210";
const BORDER = "rgba(245,239,224,0.10)";

const CAT_COLOR: Record<string, string> = {
  low: "#AAFF4D",
  medium: "#F4AB1F",
  high: "#E07070",
};

const CAT_LABEL: Record<string, string> = {
  low: "Low Displacement Risk",
  medium: "Medium Displacement Risk",
  high: "High Displacement Risk",
};

const BREAKDOWN_LABELS: Record<string, string> = {
  routineMod: "Routine tasks",
  creativeMod: "Creative work",
  humanMod: "Human interaction",
  learningProtect: "Learning openness",
  aiMitigation: "AI adoption",
  seniorityMod: "Seniority",
  domainMod: "Field context",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: DARK,
    color: OFF_WHITE,
    fontFamily: "Helvetica",
    padding: 0,
  },
  headerBand: {
    backgroundColor: SURFACE,
    padding: "32 40",
    borderBottom: `1 solid ${BORDER}`,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 6,
  },
  fieldTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: OFF_WHITE,
    letterSpacing: -0.5,
    marginBottom: 4,
    lineHeight: 1.1,
  },
  roleSubtitle: {
    fontSize: 12,
    color: MUTED,
    fontFamily: "Helvetica-Oblique",
  },
  body: {
    padding: "32 40 40",
    flex: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  scoreBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 7,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 2,
  },
  catBadge: {
    borderRadius: 4,
    padding: "3 8",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  catBadgeText: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  metaText: {
    fontSize: 12,
    color: OFF_WHITE,
    lineHeight: 1.7,
    maxWidth: 340,
    fontFamily: "Helvetica-Oblique",
  },
  twoCol: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 8,
    border: `1 solid ${BORDER}`,
    padding: "16 20",
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  breakdownText: {
    fontSize: 10,
    color: OFF_WHITE,
  },
  toolRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    borderBottom: `1 solid ${BORDER}`,
  },
  toolName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: LIME,
    minWidth: 100,
  },
  toolDesc: {
    fontSize: 10,
    color: MUTED,
    flex: 1,
    lineHeight: 1.5,
  },
  planItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  planNumber: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: LIME,
    width: 16,
    marginTop: 1,
  },
  planText: {
    fontSize: 11,
    color: OFF_WHITE,
    flex: 1,
    lineHeight: 1.6,
  },
  footer: {
    borderTop: `1 solid ${BORDER}`,
    padding: "12 40",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 0.5,
  },
  footerBrand: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: LIME,
    letterSpacing: 0.5,
  },
  divider: {
    borderTop: `1 solid ${BORDER}`,
    marginVertical: 20,
  },
});

export default function QuizReportPDF({ data }: { data: PDFReportData }) {
  const col = CAT_COLOR[data.category];
  const significantBreakdown = Object.entries(data.breakdown)
    .filter(([k, v]) => k !== "base" && v !== 0)
    .slice(0, 6);

  return (
    <Document
      title={`AIght Report — ${data.fieldName}`}
      author="AIght"
      subject="AI Impact Assessment"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBand}>
          <Text style={styles.eyebrow}>AIght — AI Impact Assessment · {data.generatedAt}</Text>
          <Text style={styles.fieldTitle}>{data.fieldName}</Text>
          {data.roleTitle && (
            <Text style={styles.roleSubtitle}>{data.roleTitle}</Text>
          )}
        </View>

        <View style={styles.body}>
          {/* Score + category */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your result</Text>
            <View style={styles.scoreRow}>
              <View style={[styles.scoreBubble, { borderColor: col }]}>
                <Text style={[styles.scoreNumber, { color: col }]}>{data.score}</Text>
                <Text style={[styles.scoreLabel, { color: col }]}>/ 100</Text>
              </View>
              <View>
                <View style={[styles.catBadge, { backgroundColor: `${col}22`, borderWidth: 1, borderColor: col }]}>
                  <Text style={[styles.catBadgeText, { color: col }]}>{CAT_LABEL[data.category]}</Text>
                </View>
                <Text style={styles.metaText}>
                  {data.category === "high"
                    ? "Your role has significant exposure to near-term AI disruption. Action now compounds."
                    : data.category === "medium"
                    ? "AI will reshape parts of your role. Strategic upskilling positions you ahead of the curve."
                    : "Your role is relatively resilient. Depth and leadership are your advantage."}
                </Text>
              </View>
            </View>
          </View>

          {/* Breakdown + risk split */}
          <View style={styles.twoCol}>
            {/* Factors */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Risk factors</Text>
              {significantBreakdown.map(([key, val]) => {
                const positive = (val as number) < 0;
                return (
                  <View key={key} style={styles.breakdownRow}>
                    <View style={[styles.dot, { backgroundColor: positive ? LIME : "#E07070" }]} />
                    <Text style={styles.breakdownText}>
                      {positive ? "↓ " : "↑ "}{BREAKDOWN_LABELS[key] ?? key}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Risk split */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Risk breakdown</Text>
              {[
                { pct: data.riskPct,  label: "Displacement risk",   color: "#E07070" },
                { pct: data.augPct,   label: "Augmentation zone",   color: "#F4AB1F" },
                { pct: data.growPct,  label: "Growth opportunity",  color: LIME },
              ].map(({ pct, label, color }) => (
                <View key={label} style={styles.breakdownRow}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={styles.breakdownText}>{pct}% — {label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tools */}
          {data.tools.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tools to learn first</Text>
              {data.tools.slice(0, 5).map((tool) => (
                <View key={tool.name} style={styles.toolRow}>
                  <Text style={styles.toolName}>{tool.name}</Text>
                  <Text style={styles.toolDesc}>{tool.what_it_does}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.divider} />

          {/* 90-day plan */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your 90-day plan</Text>
            {data.plan90.map((step, i) => (
              <View key={i} style={styles.planItem}>
                <Text style={styles.planNumber}>{i + 1}.</Text>
                <Text style={styles.planText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* 1-year vision */}
          {data.vision1yr.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>1-year vision</Text>
              {data.vision1yr.slice(0, 3).map((item, i) => (
                <View key={i} style={styles.planItem}>
                  <Text style={[styles.planNumber, { color: "#F4AB1F" }]}>→</Text>
                  <Text style={[styles.planText, { color: MUTED }]}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated on {data.generatedAt} · For personal use</Text>
          <Text style={styles.footerBrand}>AIght — aightai.in</Text>
        </View>
      </Page>
    </Document>
  );
}
