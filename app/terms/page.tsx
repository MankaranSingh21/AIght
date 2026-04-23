import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AIght",
  description: "The terms governing your use of the AIght platform.",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  fontWeight: 700,
  color: '#F5EFE0',
  letterSpacing: '-0.02em',
  margin: '0 0 14px',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial)',
  fontSize: 15,
  lineHeight: 1.85,
  color: 'rgba(245,239,224,0.60)',
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '64px 48px 96px' }}>

        {/* Back */}
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}
          className="hover:text-primary"
        >
          ← Back to AIght
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid rgba(245,239,224,0.07)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 12 }}>
            Legal
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 12px' }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.35)' }}>
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          <section>
            <p style={bodyStyle}>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              AIght (&ldquo;the Service&rdquo;), operated by{" "}
              <strong style={{ color: '#F5EFE0', fontWeight: 600 }}>Mankaran Singh</strong> (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;) at{" "}
              <span style={{ color: '#AAFF4D' }}>aightai.in</span>.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              Please read these Terms carefully before using the Service. By accessing
              AIght, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>1. Acceptance of Terms</h2>
            <p style={bodyStyle}>
              By accessing or using AIght, you confirm that you are at least 13 years
              of age, that you have read and understood these Terms, and that you
              agree to be bound by them and by our{" "}
              <Link href="/privacy" style={{ color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>2. Description of Service</h2>
            <p style={bodyStyle}>AIght is a curated AI tool directory and literary magazine. It allows anyone to:</p>
            <ul style={{ ...bodyStyle, listStyleType: 'disc', listStylePosition: 'outside', marginLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Browse and discover AI tools curated by the platform.</li>
              <li>Read editorial content about AI tools and concepts (Signal, Learn).</li>
              <li>Subscribe to a newsletter for updates.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              No account is required to use the Service. Features, tool listings, and
              content may change or be removed at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>3. Acceptable Use</h2>
            <p style={bodyStyle}>
              You agree to use the Service only for lawful purposes and in a manner
              that does not infringe the rights of others. You must not:
            </p>
            <ul style={{ ...bodyStyle, listStyleType: 'disc', listStylePosition: 'outside', marginLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Use the Service to scrape, harvest, or systematically extract data without express written permission.</li>
              <li>Introduce malicious code, bots, or automated scripts that interfere with the normal operation of the Service.</li>
              <li>Attempt to gain unauthorised access to any backend systems.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation.</li>
            </ul>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>4. Intellectual Property</h2>
            <p style={bodyStyle}>
              The AIght name, logo, codebase, design, and curated tool content are
              the intellectual property of Mankaran Singh and are protected by
              applicable copyright and trademark laws.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              Editorial content on the Service (Signal posts, Learn articles) is
              written by the operator and may not be reproduced without attribution.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>5. Disclaimer of Warranties</h2>
            <p style={bodyStyle}>
              The Service is provided <strong style={{ color: '#F5EFE0' }}>&ldquo;as is&rdquo;</strong> and{" "}
              <strong style={{ color: '#F5EFE0' }}>&ldquo;as available&rdquo;</strong> without warranties
              of any kind. Tool listings may be inaccurate, outdated, or incomplete.
              You should independently verify any information before making professional
              or financial decisions based on it.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>6. Limitation of Liability</h2>
            <p style={bodyStyle}>
              To the maximum extent permitted by applicable law, Mankaran Singh shall
              not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of, or inability
              to use, the Service.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              Our total liability to you for any claim shall not exceed ₹1,000 INR.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>7. Governing Law</h2>
            <p style={bodyStyle}>
              These Terms shall be governed by the laws of <strong style={{ color: '#F5EFE0' }}>India</strong>.
              Any disputes shall be subject to the exclusive jurisdiction of the courts
              located in India.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>8. Changes to These Terms</h2>
            <p style={bodyStyle}>
              We may modify these Terms at any time by updating the &ldquo;Last updated&rdquo;
              date at the top of this page. Continued use of the Service after changes
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>9. Contact</h2>
            <p style={bodyStyle}>Questions or concerns regarding these Terms:</p>
            <address style={{ marginTop: 16, fontStyle: 'normal', borderRadius: 12, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#F5EFE0' }}>Mankaran Singh</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)' }}>AIght — aightai.in</p>
              <a href="mailto:singhmankaran05@gmail.com" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                singhmankaran05@gmail.com
              </a>
            </address>
          </section>

        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(245,239,224,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(245,239,224,0.25)' }}>
            © {new Date().getFullYear()} AIght. Built by Mankaran Singh.
          </p>
          <Link href="/privacy" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#AAFF4D', textDecoration: 'none' }}>
            Privacy Policy →
          </Link>
        </div>

      </div>
    </main>
  );
}
