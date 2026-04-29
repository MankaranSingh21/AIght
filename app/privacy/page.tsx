import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AIght collects, uses, and protects your data.",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  fontWeight: 700,
  color: '#F5EFE0',
  letterSpacing: '-0.02em',
  margin: '0 0 14px',
};

const subHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 16,
  fontWeight: 600,
  color: '#F5EFE0',
  margin: '24px 0 8px',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-editorial)',
  fontSize: 15,
  lineHeight: 1.85,
  color: 'rgba(245,239,224,0.60)',
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.35)' }}>
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          <section>
            <p style={bodyStyle}>
              AIght (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Service&rdquo;) is a personal project built
              and operated by Mankaran Singh. We take your privacy seriously. This
              Privacy Policy explains what information we collect, why we collect it,
              and how we protect it when you use{" "}
              <span style={{ color: '#AAFF4D', fontStyle: 'normal' }}>aightai.in</span>.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              AIght does not require an account. You can browse the tool directory,
              read Signal posts, and explore Learn content without providing any
              personal information.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>1. Information We Collect</h2>
            <p style={bodyStyle}>
              We collect only what is necessary to run the Service. We do not sell,
              rent, or share your personal data with third parties for marketing
              purposes.
            </p>
            <h3 style={subHeadingStyle}>Newsletter Subscriptions</h3>
            <p style={bodyStyle}>
              If you choose to subscribe to our newsletter, we collect your{" "}
              <strong style={{ color: '#F5EFE0', fontWeight: 600 }}>email address</strong>. This is
              entirely optional. Your email is stored in our database and used solely
              to send you AIght updates. You can unsubscribe at any time by replying
              to any newsletter email.
            </p>
            <h3 style={subHeadingStyle}>Usage &amp; Analytics Data</h3>
            <p style={bodyStyle}>
              We use <strong style={{ color: '#F5EFE0', fontWeight: 600 }}>PostHog</strong> for product
              analytics. This may collect anonymised event data such as pages visited,
              features used, and session duration. We do not collect device
              fingerprints or sell analytics data. You can opt out via your
              browser&rsquo;s &ldquo;Do Not Track&rdquo; header.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>2. How We Use Your Information</h2>
            <ul style={{ ...bodyStyle, listStyleType: 'disc', listStylePosition: 'outside', marginLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>To send newsletter emails to subscribers who opt in.</li>
              <li>To improve the Service by understanding how features are used in aggregate.</li>
            </ul>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              We will never use your data to train AI models, serve advertisements,
              or share it with data brokers.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>3. Third-Party Services</h2>
            <p style={bodyStyle}>
              AIght uses several third-party services to function. By using the
              Service you acknowledge that data may be processed by these providers
              under their own privacy policies.
            </p>
            <div style={{ marginTop: 20, borderRadius: 12, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { name: 'Supabase', desc: <>Hosts our database. Newsletter subscriber emails are stored on Supabase infrastructure. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2 }}>supabase.com/privacy</a>.</> },
                { name: 'PostHog', desc: 'Provides anonymised product analytics. No personally identifiable information beyond session metadata is transmitted.' },
                { name: 'Microlink', desc: 'Used to fetch website screenshots for tool cards. Only publicly available tool URLs are sent to this service.' },
              ].map(({ name, desc }) => (
                <div key={name}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#F5EFE0', marginBottom: 4 }}>{name}</p>
                  <p style={{ ...bodyStyle, fontSize: 13 }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>4. Data Security</h2>
            <p style={bodyStyle}>
              We implement industry-standard safeguards including TLS encryption in
              transit and row-level security policies on our database. Access to
              production data is restricted to the service operator.
            </p>
            <p style={{ ...bodyStyle, marginTop: 14 }}>
              No method of electronic storage or transmission is 100% secure. In the
              event of a breach that affects your personal data, we will notify you
              promptly.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>5. Data Retention</h2>
            <p style={bodyStyle}>
              Newsletter subscriber emails are retained until you request removal.
              You may request deletion of your email at any time by contacting{" "}
              <a href="mailto:singhmankaran05@gmail.com" style={{ color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                singhmankaran05@gmail.com
              </a>. We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>6. Your Rights</h2>
            <p style={bodyStyle}>
              Depending on your jurisdiction you may have the right to access,
              correct, or delete your personal data. To exercise any of these rights,
              contact us at{" "}
              <a href="mailto:singhmankaran05@gmail.com" style={{ color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                singhmankaran05@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>7. Changes to This Policy</h2>
            <p style={bodyStyle}>
              We may update this Privacy Policy from time to time. Material changes
              will be communicated via a notice on the site. Continued use of the
              Service after changes constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 style={sectionHeadingStyle}>8. Contact</h2>
            <p style={bodyStyle}>Questions or concerns regarding this Privacy Policy:</p>
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
          <Link href="/terms" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#AAFF4D', textDecoration: 'none' }}>
            Terms of Service →
          </Link>
        </div>

      </div>
    </main>
  );
}
