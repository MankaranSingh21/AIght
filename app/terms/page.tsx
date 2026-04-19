import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AIght",
  description: "The terms governing your use of the AIght platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="font-sans text-sm text-secondary">
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        {/* Body */}
        <div className="space-y-12 font-sans text-secondary leading-relaxed">

          <section className="space-y-4">
            <p className="text-base">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              AIght (&ldquo;the Service&rdquo;), operated by{" "}
              <strong className="text-primary">Mankaran Singh</strong> (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;) at{" "}
              <span className="text-accent font-medium">aightai.in</span>.
            </p>
            <p>
              Please read these Terms carefully before using the Service. By accessing
              AIght, you agree to be bound by these Terms.
            </p>
          </section>

          {/* 1 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AIght, you confirm that you are at least 13 years
              of age, that you have read and understood these Terms, and that you
              agree to be bound by them and by our{" "}
              <Link
                href="/privacy"
                className="text-accent hover:text-accent-dim underline underline-offset-2"
              >
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              2. Description of Service
            </h2>
            <p>
              AIght is a curated AI tool directory and literary magazine. It allows
              anyone to:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Browse and discover AI tools curated by the platform.</li>
              <li>Read editorial content about AI tools and concepts (Signal, Learn).</li>
              <li>Subscribe to a newsletter for updates.</li>
            </ul>
            <p>
              No account is required to use the Service. Features, tool listings, and
              content may change or be removed at any time without prior notice.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              3. Acceptable Use
            </h2>
            <p>
              You agree to use the Service only for lawful purposes and in a manner
              that does not infringe the rights of others. You must not:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                Use the Service to scrape, harvest, or systematically extract data
                without express written permission.
              </li>
              <li>
                Introduce malicious code, bots, or automated scripts that interfere
                with the normal operation of the Service.
              </li>
              <li>
                Attempt to gain unauthorised access to any backend systems.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your affiliation.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              4. Intellectual Property
            </h2>
            <p>
              The AIght name, logo, codebase, design, and curated tool content are
              the intellectual property of Mankaran Singh and are protected by
              applicable copyright and trademark laws.
            </p>
            <p>
              Editorial content on the Service (Signal posts, Learn articles) is
              written by the operator and may not be reproduced without attribution.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              5. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided <strong className="text-primary">&ldquo;as is&rdquo;</strong> and{" "}
              <strong className="text-primary">&ldquo;as available&rdquo;</strong> without warranties
              of any kind. Tool listings may be inaccurate, outdated, or incomplete.
              You should independently verify any information before making professional
              or financial decisions based on it.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              6. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Mankaran Singh shall
              not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of, or inability
              to use, the Service.
            </p>
            <p>
              Our total liability to you for any claim shall not exceed ₹1,000 INR.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              7. Governing Law
            </h2>
            <p>
              These Terms shall be governed by the laws of <strong className="text-primary">India</strong>.
              Any disputes shall be subject to the exclusive jurisdiction of the courts
              located in India.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              8. Changes to These Terms
            </h2>
            <p>
              We may modify these Terms at any time by updating the &ldquo;Last updated&rdquo;
              date at the top of this page. Continued use of the Service after changes
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold text-primary">
              9. Contact
            </h2>
            <p>
              Questions or concerns regarding these Terms:
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
            href="/privacy"
            className="font-sans text-xs text-accent hover:text-accent-dim transition-colors duration-150"
          >
            Privacy Policy →
          </Link>
        </div>

      </div>
    </main>
  );
}
