import "server-only";
import { getResend, RESEND_FROM, SITE_URL } from "@/lib/resend";

// Subject line + plain-text + HTML in one place. Plain text is the fallback
// for clients that don't render HTML and for accessibility.
const SUBJECT = "You're in the signal.";

function plainText(): string {
  return [
    `Welcome to AIght.`,
    ``,
    `You'll get one short note when something on the site is worth your`,
    `attention — a new concept article, a tool that earned its place, an`,
    `essay that took its time to write. No daily digest, no marketing.`,
    ``,
    `Start here:`,
    `· The universe map — ${SITE_URL}/learn/map`,
    `· The AI Impact Quiz — ${SITE_URL}/learn/paths/quiz`,
    `· What AI cannot do — ${SITE_URL}/human`,
    ``,
    `Easy unsubscribe in every email. Reply to this one if anything`,
    `breaks or you have something to point me at.`,
    ``,
    `— Mankaran`,
    `AIght · ${SITE_URL}`,
  ].join("\n");
}

function html(): string {
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
            Welcome
          </p>
          <h1 style="font-family:'Georgia',serif;font-size:36px;font-weight:700;color:#F5EFE0;letter-spacing:-0.02em;line-height:1.1;margin:0 0 24px;">
            You're in the signal.
          </h1>
          <p style="font-size:16px;line-height:1.7;color:rgba(245,239,224,0.78);margin:0 0 16px;">
            You'll get one short note when something on the site is worth your attention &mdash; a new concept article, a tool that earned its place, an essay that took its time to write.
          </p>
          <p style="font-size:16px;line-height:1.7;color:rgba(245,239,224,0.78);margin:0 0 32px;">
            No daily digest. No marketing. If a week goes by without anything good to send, no email goes out.
          </p>
        </td></tr>

        <tr><td style="padding:24px 0;border-top:1px solid rgba(245,239,224,0.10);border-bottom:1px solid rgba(245,239,224,0.10);">
          <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,239,224,0.45);margin:0 0 14px;">
            Three places to start
          </p>
          <p style="font-size:15px;line-height:1.8;color:#F5EFE0;margin:0;">
            <a href="${SITE_URL}/learn/map" style="color:#AAFF4D;text-decoration:none;">The universe map</a> &mdash; every field, concept, and tool, on one canvas<br/>
            <a href="${SITE_URL}/learn/paths/quiz" style="color:#AAFF4D;text-decoration:none;">The AI Impact Quiz</a> &mdash; how AI actually changes your work<br/>
            <a href="${SITE_URL}/human" style="color:#AAFF4D;text-decoration:none;">What AI cannot do</a> &mdash; the human strengths it won't compress
          </p>
        </td></tr>

        <tr><td style="padding-top:32px;">
          <p style="font-size:14px;line-height:1.7;color:rgba(245,239,224,0.62);font-style:italic;margin:0 0 8px;">
            &mdash; Mankaran
          </p>
          <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.06em;color:rgba(245,239,224,0.35);margin:0;">
            AIght &middot; <a href="${SITE_URL}" style="color:rgba(245,239,224,0.55);text-decoration:none;">aightai.in</a>
          </p>
        </td></tr>

        <tr><td style="padding-top:40px;">
          <p style="font-size:11px;line-height:1.6;color:rgba(245,239,224,0.35);margin:0;">
            You received this because you signed up at aightai.in. Reply with "unsubscribe" to remove yourself, or <a href="mailto:hello@aightai.in?subject=unsubscribe" style="color:rgba(245,239,224,0.55);">email me directly</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Send the welcome email. Returns `true` on success, `false` on any failure.
// Caller treats it as fire-and-forget — a failure should not block the
// subscriber row in Supabase.
export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    // RESEND_API_KEY not set — silently skip. Useful for local dev.
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: SUBJECT,
      html: html(),
      text: plainText(),
    });
    if (error) {
      console.error("[sendWelcomeEmail] resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sendWelcomeEmail] threw:", err);
    return false;
  }
}
