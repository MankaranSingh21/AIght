import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-moss-200 bg-parchment">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand + trust line */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="font-serif text-lg font-bold text-espresso">AIght ✦</p>
          <p className="font-body text-xs text-forest/50">
            Built with 🌿 by Mankaran Singh
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6 flex-wrap justify-center">
          <Link
            href="/privacy"
            className="font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150"
          >
            Terms of Service
          </Link>
          <a
            href="mailto:singhmankaran05@gmail.com"
            className="font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
