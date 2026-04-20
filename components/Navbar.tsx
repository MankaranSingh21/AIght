import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-16 sticky top-0 z-50 bg-panel backdrop-blur-md border-b border-subtle">
      <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <span className="font-mono text-xl font-medium text-primary leading-none">
            AIght<span className="logo-cursor">_</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/learn" className="nav-link">Learn</Link>
          <Link href="/tools" className="nav-link">Tools</Link>
          <Link href="/signal" className="nav-link">Signal</Link>
        </div>
      </div>
    </nav>
  );
}
