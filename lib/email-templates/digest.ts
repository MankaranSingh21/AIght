import "server-only";
import { getResend, RESEND_FROM, SITE_URL } from "@/lib/resend";

export type DigestItem = {
  kind: "concept" | "tool" | "signal";
  title: string;
  tagline: string;
  href: string;
};

const SUBJECT = "This week on AIght.";

function plainText(items: DigestItem[]): string {
  const groups: Record<DigestItem["kind"], DigestItem[]> = {
    concept: items.filter((i) => i.kind === "concept"),
    tool: items.filter((i) => i.kind === "tool"),
    signal: items.filter((i) => i.kind === "signal"),
  };
  const lines: string[] = [];
  lines.push("This week on AIght.");
  lines.push("");
  if (groups.signal.length) {
    lines.push("Essays");
    for (const it of groups.signal) {
      lines.push(`· ${it.title} — ${SITE_URL}${it.href}`);
      lines.push(`  ${it.tagline}`);
    }
    lines.push("");
  }
  if (groups.concept.length) {
    lines.push("New concepts");
    for (const it of groups.concept) {
      lines.push(`· ${it.title} — ${SITE_URL}${it.href}`);
      lines.push(`  ${it.tagline}`);
    }
    lines.push("");
  }
  if (groups.tool.length) {
    lines.push("New tools");
    for (const it of groups.tool) {
      lines.push(`· ${it.title} — ${SITE_URL}${it.href}`);
      lines.push(`  ${it.tagline}`);
    }
    lines.push("");
  }
  lines.push("— Mankaran");
  lines.push(`AIght · ${SITE_URL}`);
  lines.push("");
  lines.push("Reply 'unsubscribe' to stop.");
  return lines.join("\n");
}

function section(label: string, items: DigestItem[]): string {
  if (!items.length) return "";
  const rows = items
    .map(
      (it) => /* html */ `
      <p style="font-size:15px;line-height:1.6;color:#F5EFE0;margin:0 0 14px;">
        <a href="${SITE_URL}${it.href}" style="color:#AAFF4D;text-decoration:none;font-weight:600;">${it.title}</a><br/>
        <span style="color:rgba(245,239,224,0.62);font-size:14px;">${it.tagline}</span>
      </p>`
    )
    .join("");
  return /* html */ `
    <tr><td style="padding:24px 0;border-top:1px solid rgba(245,239,224,0.10);">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,239,224,0.45);margin:0 0 16px;">
        ${label}
      </p>
      ${rows}
    </td></tr>`;
}

function html(items: DigestItem[]): string {
  const signal = items.filter((i) => i.kind === "signal");
  const concept = items.filter((i) => i.kind === "concept");
  const tool = items.filter((i) => i.kind === "tool");
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:#0C0A08;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#F5EFE0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0C0A08;">
    <tr><td align="center" style="padding:48px 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
        <tr><td style="padding:0 0 32px 0;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#F5EFE0;letter-spacing:-0.5px;">AI<span style="color:#AAFF4D;">ght</span><span style="color:#AAFF4D;">_</span></span>
        </td></tr>

        <tr><td>
          <p style="font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#AAFF4D;margin:0 0 16px;">
            Weekly digest
          </p>
          <h1 style="font-family:'Georgia',serif;font-size:32px;font-weight:700;color:#F5EFE0;letter-spacing:-0.02em;line-height:1.15;margin:0 0 24px;">
            This week on AIght.
          </h1>
          <p style="font-size:15px;line-height:1.7;color:rgba(245,239,224,0.72);margin:0 0 8px;">
            A short note on what's worth your attention.
          </p>
        </td></tr>

        ${section("Essays", signal)}
        ${section("New concepts", concept)}
        ${section("New tools", tool)}

        <tr><td style="padding-top:32px;border-top:1px solid rgba(245,239,224,0.10);">
          <p style="font-size:14px;line-height:1.7;color:rgba(245,239,224,0.62);font-style:italic;margin:0 0 8px;">
            &mdash; Mankaran
          </p>
          <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.06em;color:rgba(245,239,224,0.35);margin:0;">
            AIght &middot; <a href="${SITE_URL}" style="color:rgba(245,239,224,0.55);text-decoration:none;">aightai.in</a>
          </p>
        </td></tr>

        <tr><td style="padding-top:40px;">
          <p style="font-size:11px;line-height:1.6;color:rgba(245,239,224,0.35);margin:0;">
            You're receiving this because you signed up at aightai.in. Reply "unsubscribe" to remove yourself, or <a href="mailto:hello@aightai.in?subject=unsubscribe" style="color:rgba(245,239,224,0.55);">email me directly</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendDigestEmail(
  to: string,
  items: DigestItem[]
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  if (!items.length) return false;
  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: SUBJECT,
      html: html(items),
      text: plainText(items),
    });
    if (error) {
      console.error("[sendDigestEmail] resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sendDigestEmail] threw:", err);
    return false;
  }
}
