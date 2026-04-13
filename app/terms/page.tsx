import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AIght",
  description: "The terms governing your use of the AIght platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="font-body text-sm text-forest/50">
            Last updated: <time dateTime="2026-04">April 2026</time>
          </p>
        </div>

        {/* Body */}
        <div className="space-y-12 font-body text-forest/80 leading-relaxed">

          <section className="space-y-4">
            <p className="text-base">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              AIght (&ldquo;the Service&rdquo;), operated by{" "}
              <strong className="text-espresso">Mankaran Singh</strong> (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;) at{" "}
              <span className="text-moss-600 font-medium">aight.app</span>.
            </p>
            <p>
              Please read these Terms carefully before using the Service. By creating
              an account or otherwise accessing AIght, you agree to be bound by these
              Terms.
            </p>
          </section>

          {/* 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AIght, you confirm that you are at least 13 years
              of age (or the minimum digital age of consent in your jurisdiction,
              whichever is higher), that you have read and understood these Terms, and
              that you agree to be bound by them and by our{" "}
              <Link
                href="/privacy"
                className="text-moss-600 hover:text-moss-700 underline underline-offset-2"
              >
                Privacy Policy
              </Link>.
            </p>
            <p>
              If you are using the Service on behalf of an organisation, you represent
              that you have the authority to bind that organisation to these Terms.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              2. Description of Service
            </h2>
            <p>
              AIght is a curated AI tool directory and visual roadmap builder. It
              allows registered users to:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Browse and discover AI tools curated by the platform.</li>
              <li>
                Submit natural-language prompts to generate personalised, AI-curated
                roadmaps of tools relevant to their goals.
              </li>
              <li>Build and manage visual canvases of tool workflows.</li>
              <li>Share read-only views of their canvases with others.</li>
            </ul>
            <p>
              The Service is provided on an &ldquo;as is&rdquo; basis. Features, tool listings,
              and AI outputs may change or be removed at any time without prior notice.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              3. User Accounts
            </h2>
            <p>
              You must create an account to access personalised features. You are
              responsible for maintaining the security of your account and for all
              activity that occurs under it. You must notify us immediately of any
              unauthorised access.
            </p>
            <p>
              We reserve the right to terminate accounts that violate these Terms,
              are inactive for extended periods, or where required by law.
            </p>
          </section>

          {/* 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              4. User Conduct
            </h2>
            <p>
              You agree to use the Service only for lawful purposes and in a manner
              that does not infringe the rights of others. You must not:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                Submit prompts designed to generate harmful, illegal, defamatory,
                or otherwise objectionable content.
              </li>
              <li>
                Attempt to manipulate, jailbreak, or otherwise circumvent the
                safety measures of any AI model integrated into the Service.
              </li>
              <li>
                Use the Service to scrape, harvest, or systematically extract data
                from the platform without express written permission.
              </li>
              <li>
                Introduce malicious code, bots, or automated scripts that interfere
                with the normal operation of the Service.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your affiliation
                with any person or entity.
              </li>
              <li>
                Attempt to gain unauthorised access to other users&rsquo; accounts
                or any backend systems.
              </li>
            </ul>
            <p>
              We reserve the right to remove content and suspend accounts that
              violate these conduct rules without prior notice or refund.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              5. Intellectual Property
            </h2>
            <p>
              The AIght name, logo, codebase, design, and curated tool content are
              the intellectual property of Mankaran Singh and are protected by
              applicable copyright and trademark laws.
            </p>
            <p>
              You retain ownership of any original prompts and content you submit to
              the Service. By submitting content, you grant us a non-exclusive,
              royalty-free, worldwide licence to store and display that content solely
              for the purpose of providing and improving the Service.
            </p>
            <p>
              AI-generated roadmaps produced by the Service are the result of automated
              processing. We make no claim of copyright over AI outputs, but we also
              do not warrant their accuracy, completeness, or fitness for any particular
              purpose.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              6. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
              <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, express
              or implied, including but not limited to warranties of merchantability,
              fitness for a particular purpose, non-infringement, or that the Service
              will be uninterrupted, error-free, or free of viruses.
            </p>
            <p>
              AI-generated content may be inaccurate, incomplete, or outdated. You
              should independently verify any information provided by the AI Curator
              before making professional or financial decisions based on it.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Mankaran Singh shall
              not be liable for any indirect, incidental, special, consequential, or
              punitive damages — including but not limited to loss of data, loss of
              revenue, loss of profits, or loss of goodwill — arising out of or
              related to your use of, or inability to use, the Service, even if
              advised of the possibility of such damages.
            </p>
            <p>
              Our total liability to you for any claim arising from or related to
              these Terms or the Service shall not exceed the greater of (a) the
              amounts you paid us, if any, in the twelve months preceding the claim,
              or (b) ₹1,000 INR.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              8. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the
              laws of <strong>India</strong>, without regard to its conflict of law
              provisions. Any disputes arising under or in connection with these
              Terms shall be subject to the exclusive jurisdiction of the courts
              located in India.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              9. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide
              notice of material changes by updating the &ldquo;Last updated&rdquo; date at the
              top of this page and, where appropriate, by notifying you via email.
              Continued use of the Service after the effective date of any changes
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* 10 */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              10. Contact
            </h2>
            <p>
              Questions or concerns regarding these Terms should be directed to:
            </p>
            <address className="not-italic rounded-2xl border border-moss-200 bg-moss-50/40 px-6 py-5 text-sm space-y-1">
              <p className="font-semibold text-espresso">Mankaran Singh</p>
              <p>AIght — aight.app</p>
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
            href="/privacy"
            className="font-body text-xs text-moss-600 hover:text-moss-700 transition-colors duration-150"
          >
            Privacy Policy →
          </Link>
        </div>

      </div>
    </main>
  );
}
