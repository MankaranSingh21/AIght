import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AIght",
  description: "How AIght collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-secondary hover:text-primary transition-colors duration-150 mb-12"
        >
          ← Back to AIght
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-subtle">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Legal
          </p>
          <h1 className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-secondary">
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        {/* Body */}
        <div className="space-y-12 font-sans text-secondary leading-relaxed">

          <section className="space-y-4">
            <p className="text-base">
              AIght (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Service&rdquo;) is a personal project built
              and operated by Mankaran Singh. We take your privacy seriously. This
              Privacy Policy explains what information we collect, why we collect it,
              and how we protect it when you use{" "}
              <span className="text-accent font-medium">aightai.in</span>.
            </p>
            <p className="text-base">
              AIght does not require an account. You can browse the tool directory,
              read Signal posts, and explore Learn content without providing any
              personal information.
            </p>
          </section>

          {/* 1 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              1. Information We Collect
            </h2>
            <p>
              We collect only what is necessary to run the Service. We do not sell,
              rent, or share your personal data with third parties for marketing
              purposes.
            </p>

            <h3 className="font-sans text-lg font-medium text-primary mt-6">
              Newsletter Subscriptions
            </h3>
            <p>
              If you choose to subscribe to our newsletter, we collect your
              <strong className="text-primary"> email address</strong>. This is
              entirely optional. Your email is stored in our database and used solely
              to send you AIght updates. You can unsubscribe at any time by replying
              to any newsletter email.
            </p>

            <h3 className="font-sans text-lg font-medium text-primary mt-6">
              Usage &amp; Analytics Data
            </h3>
            <p>
              We use <strong className="text-primary">PostHog</strong> for product
              analytics. This may collect anonymised event data such as pages visited,
              features used, and session duration. We do not collect device
              fingerprints or sell analytics data. You can opt out via your
              browser&rsquo;s &ldquo;Do Not Track&rdquo; header.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>To send newsletter emails to subscribers who opt in.</li>
              <li>
                To improve the Service by understanding how features are used in
                aggregate.
              </li>
            </ul>
            <p>
              We will never use your data to train AI models, serve advertisements,
              or share it with data brokers.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              3. Third-Party Services
            </h2>
            <p>
              AIght uses several third-party services to function. By using the
              Service you acknowledge that data may be processed by these providers
              under their own privacy policies.
            </p>

            <div className="rounded-lg border border-subtle bg-raised p-6 space-y-4">
              <div>
                <p className="font-sans font-medium text-primary">Supabase</p>
                <p className="text-sm mt-1">
                  Hosts our database. Newsletter subscriber emails are stored on
                  Supabase infrastructure. See{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-dim underline underline-offset-2"
                  >
                    supabase.com/privacy
                  </a>.
                </p>
              </div>
              <div>
                <p className="font-sans font-medium text-primary">PostHog</p>
                <p className="text-sm mt-1">
                  Provides anonymised product analytics. No personally identifiable
                  information beyond session metadata is transmitted.
                </p>
              </div>
              <div>
                <p className="font-sans font-medium text-primary">Microlink</p>
                <p className="text-sm mt-1">
                  Used to fetch website screenshots for tool cards. Only publicly
                  available tool URLs are sent to this service.
                </p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              4. Data Security
            </h2>
            <p>
              We implement industry-standard safeguards including TLS encryption in
              transit and row-level security policies on our database. Access to
              production data is restricted to the service operator.
            </p>
            <p>
              No method of electronic storage or transmission is 100% secure. In the
              event of a breach that affects your personal data, we will notify you
              promptly.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              5. Data Retention
            </h2>
            <p>
              Newsletter subscriber emails are retained until you request removal.
              You may request deletion of your email at any time by contacting{" "}
              <a
                href="mailto:singhmankaran05@gmail.com"
                className="text-accent hover:text-accent-dim underline underline-offset-2"
              >
                singhmankaran05@gmail.com
              </a>. We will process deletion requests within 30 days.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              6. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction you may have the right to access,
              correct, or delete your personal data. To exercise any of these rights,
              contact us at{" "}
              <a
                href="mailto:singhmankaran05@gmail.com"
                className="text-accent hover:text-accent-dim underline underline-offset-2"
              >
                singhmankaran05@gmail.com
              </a>.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes
              will be communicated via a notice on the site. Continued use of the
              Service after changes constitutes your acceptance of the revised policy.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              8. Contact
            </h2>
            <p>
              Questions or concerns regarding this Privacy Policy:
            </p>
            <address className="not-italic rounded-lg border border-subtle bg-raised px-6 py-5 text-sm space-y-1">
              <p className="font-sans font-medium text-primary">Mankaran Singh</p>
              <p>AIght — aightai.in</p>
              <p>
                <a
                  href="mailto:singhmankaran05@gmail.com"
                  className="text-accent hover:text-accent-dim underline underline-offset-2"
                >
                  singhmankaran05@gmail.com
                </a>
              </p>
            </address>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-muted">
            © {new Date().getFullYear()} AIght. Built by Mankaran Singh.
          </p>
          <Link
            href="/terms"
            className="font-sans text-xs text-accent hover:text-accent-dim transition-colors duration-150"
          >
            Terms of Service →
          </Link>
        </div>

      </div>
    </main>
  );
}
