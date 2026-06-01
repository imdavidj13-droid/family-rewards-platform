export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-black text-white">
          ⭐ Family Rewards
        </h1>

        <nav className="hidden gap-8 text-sm font-semibold text-white/70 md:flex">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Login</a>
        </nav>

        <button className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500">
          Get Started
        </button>
      </div>
    </header>
  );
}