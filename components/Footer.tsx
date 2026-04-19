import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-panel">
      <div className="max-w-content mx-auto px-6 md:px-12 py-14">

        {/* Social proof strip */}
        <div className="flex flex-wrap items-center gap-8 mb-10 pb-10 border-b border-subtle">
          {[
            { stat: "52+",   label: "curated tools" },
            { stat: "100%",  label: "no sponsored rankings" },
            { stat: "0",     label: "affiliate links" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-semibold text-accent">{stat}</span>
              <span className="font-sans text-sm text-secondary">{label}</span>
            </div>
          ))}
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="space-y-3">
            <p className="font-mono text-xl font-medium text-primary">
              AIght<span className="logo-cursor">_</span>
            </p>
            <p className="font-sans text-sm text-secondary leading-relaxed max-w-xs">
              A literary magazine covering AI.
              Curated slowly, on purpose.
            </p>
          </div>

          {/* Navigation column */}
          <nav className="space-y-2">
            <p className="font-sans text-xs uppercase tracking-widest text-muted mb-3">
              Navigate
            </p>
            {[
              { href: "/",        label: "Home" },
              { href: "/learn",   label: "Learn" },
              { href: "/tools",   label: "Tools" },
              { href: "/signal",  label: "Signal" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms",   label: "Terms of Service" },
            ].map(({ href, label }) => (
              <div key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
                >
                  {label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Newsletter column */}
          <div className="space-y-3">
            <p className="font-sans text-xs uppercase tracking-widest text-muted mb-3">
              Stay in the signal
            </p>
            <p className="font-sans text-sm text-secondary leading-relaxed">
              New tools, new stacks, and the occasional note from the archive.
              No spam — ever.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-muted">
            © {new Date().getFullYear()} AIght. Built by{" "}
            <a
              href="mailto:singhmankaran05@gmail.com"
              className="hover:text-primary transition-colors duration-150"
            >
              Mankaran Singh
            </a>
          </p>
          <p className="font-sans text-xs text-muted italic">
            Built slowly, on purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
