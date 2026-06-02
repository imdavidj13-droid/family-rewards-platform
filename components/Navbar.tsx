import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-white">
            R
          </div>

          <span className="text-xl font-black text-white">
            Family Rewards
          </span>
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold text-white/70 md:flex">
          <Link href="/features" className="hover:text-white">
            Features
          </Link>

          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>

          <Link href="/login" className="hover:text-white">
            Login
          </Link>
        </nav>

        <Link
          href="/signup"
          className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}