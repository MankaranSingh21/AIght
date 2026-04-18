import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AIght",
  description: "How AIght collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-sm text-forest/50 hover:text-forest transition-colors duration-150 mb-12"
        >
          ← Back to AIght
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-moss-200">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 mb-3">
            Legal ✦
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-body text-sm text-forest/50">
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        {/* Body */}
        <div className="space-y-12 font-body text-forest/80 leading-relaxed">

          <section className="space-y-4">
            <p className="text-base">
              AIght (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Service&rdquo;) is a personal project built
              and operated by Mankaran Singh. We take your privacy seriously. This
              Privacy Policy explains what information we collect, why we collect it,
              and how we protect it when you use{" "}
              <span className="text-moss-600 font-medium">aightai.in</span>.
            </p>
            <p className="text-base">
              By using AIght, you agree to the practices described in this policy. If
              you disagree with any part of it, please discontinue use of the Service.
            </p>
          </section>

          {/* 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              1. Information We Collect
            </h2>
            <p>
              We collect only what is necessary to run the Service. We do not sell,
              rent, or share your personal data with third parties for marketing
              purposes.
            </p>

            <h3 className="font-serif text-lg font-semibold text-espresso mt-6">
              Account &amp; Authentication Data
            </h3>
            <p>
              When you sign in, we collect your <strong>email address</strong> via
              a magic link flow powered by Supabase Auth. We do not store passwords.
              Your email is used solely for authentication and, if you opt in,
              transactional notifications about your account.
            </p>

            <h3 className="font-serif text-lg font-semibold text-espresso mt-6">
              Roadmap &amp; Canvas Data
            </h3>
            <p>
              When you use the AI Curator or manually build a canvas, we store the
              prompts you submit, the roadmaps generated, the tools you add, and
              the step-by-step progress you record. This data is tied to your account
              and stored securely in our database so you can access it across devices.
            </p>

            <h3 className="font-serif text-lg font-semibold text-espresso mt-6">
              Usage &amp; Analytics Data
            </h3>
            <p>
              We use <strong>PostHog</strong> for product analytics. This may collect
              anonymised event data such as pages visited, features used, and session
              duration. We do not collect device fingerprints or sell analytics data.
              You can opt out via your browser&rsquo;s &ldquo;Do Not Track&rdquo; header.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>To authenticate you and maintain your session.</li>
              <li>To store and display your roadmaps and canvases.</li>
              <li>
                To generate AI-powered roadmaps on your behalf by forwarding your
                prompts to a third-party language model (see Section 3).
              </li>
              <li>
                To improve the Service by understanding how features are used in
                aggregate.
              </li>
              <li>
                To contact you in the event of a security incident affecting your
                account.
              </li>
            </ul>
            <p>
              We will never use your data to train AI models, serve advertisements,
              or share it with data brokers.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              3. Third-Party Services &amp; AI APIs
            </h2>
            <p>
              AIght integrates several third-party services to function. By using the
              Service you acknowledge that data may be processed by these providers
              under their own privacy policies.
            </p>

            <div className="rounded-2xl border border-moss-200 bg-moss-50/40 p-6 space-y-4">
              <div>
                <p className="font-semibold text-espresso">Supabase</p>
                <p className="text-sm">
                  Hosts our database and authentication. Your email address and
                  roadmap data are stored on Supabase infrastructure.
                  See{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
                  >
                    supabase.com/privacy
                  </a>.
                </p>
              </div>
              <div>
                <p className="font-semibold text-espresso">Google Gemini API</p>
                <p className="text-sm">
                  Powers our AI Curator feature. When you submit a prompt to generate
                  a roadmap, <strong>that prompt text is sent to Google&rsquo;s Gemini
                  API</strong> to produce a personalised tool selection. Do not include
                  sensitive personal information in roadmap prompts. Google&rsquo;s data
                  handling is governed by their{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>.
                </p>
              </div>
              <div>
                <p className="font-semibold text-espresso">PostHog</p>
                <p className="text-sm">
                  Provides anonymised product analytics. No personally identifiable
                  information beyond your user ID is transmitted.
                </p>
              </div>
              <div>
                <p className="font-semibold text-espresso">Microlink &amp; Clearbit</p>
                <p className="text-sm">
                  Used to fetch website screenshots and company logos for tool
                  cards. Only publicly available tool URLs are sent to these services.
                </p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              4. Data Security
            </h2>
            <p>
              We implement industry-standard safeguards including TLS encryption in
              transit, row-level security policies on our database, and
              httpOnly session cookies. Access to production data is restricted to
              the service operator.
            </p>
            <p>
              No method of electronic storage or transmission is 100% secure. While
              we strive to protect your data, we cannot guarantee absolute security.
              In the event of a breach that affects your personal data, we will
              notify you promptly.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              5. Data Retention
            </h2>
            <p>
              Your account data and roadmaps are retained for as long as your
              account is active. You may request deletion of your account and all
              associated data at any time by emailing{" "}
              <a
                href="mailto:singhmankaran05@gmail.com"
                className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
              >
                singhmankaran05@gmail.com
              </a>. We will process deletion requests within 30 days.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              6. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction you may have the right to access,
              correct, or delete your personal data, and to object to or restrict
              certain processing. To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:singhmankaran05@gmail.com"
                className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
              >
                singhmankaran05@gmail.com
              </a>.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
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
            <h2 className="font-serif text-2xl font-bold text-espresso">
              8. Contact
            </h2>
            <p>
              Questions, concerns, or requests regarding this Privacy Policy should
              be directed to:
            </p>
            <address className="not-italic rounded-2xl border border-moss-200 bg-moss-50/40 px-6 py-5 text-sm space-y-1">
              <p className="font-semibold text-espresso">Mankaran Singh</p>
              <p>AIght — aightai.in</p>
              <p>
                <a
                  href="mailto:singhmankaran05@gmail.com"
                  className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
                >
                  singhmankaran05@gmail.com
                </a>
              </p>
            </address>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-moss-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-forest/40">
            © {new Date().getFullYear()} AIght. Built with 🌿 by Mankaran Singh.
          </p>
          <Link
            href="/terms"
            className="font-body text-xs text-moss-600 hover:text-moss-700 transition-colors duration-150"
          >
            Terms of Service →
          </Link>
        </div>

      </div>
    </main>
  );
}
