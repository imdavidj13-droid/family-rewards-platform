"use client";

import Link from "next/link";

export default function ChildSidebar({ child }: { child: any }) {
  const points = child?.points || 0;
  const level = Math.floor(points / 100) + 1;

  const ranks = [
    "Deckhand",
    "Cabin Mate",
    "First Mate",
    "Navigator",
    "Captain",
    "Admiral",
  ];

  const rank = ranks[Math.min(level - 1, ranks.length - 1)];

  const links = [
  { href: "/child", label: "Dashboard", icon: "🏠", active: true },
  { href: "/child", label: "Quests", icon: "🗺️" },
  { href: "/child", label: "Reward Shop", icon: "🎁" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
  { href: "/children", label: "My Crew", icon: "👨‍👩‍👧" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

  return (
    <aside className="min-h-screen w-56 shrink-0 overflow-hidden border-r-4 border-yellow-900 bg-gradient-to-b from-slate-950 via-sky-950 to-slate-950 text-yellow-100 shadow-2xl">
      <div className="p-4 text-center">
        <div className="rounded-2xl border-4 border-yellow-800 bg-red-800 px-3 py-3 shadow-xl">
          <p className="text-lg font-black leading-none text-yellow-100">
            FAMILY
          </p>
          <p className="text-lg font-black leading-none text-yellow-300">
            REWARDS
          </p>
        </div>
      </div>

      <div className="border-y-4 border-yellow-900/70 bg-slate-900/70 px-4 py-5 text-center">
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-yellow-600 bg-gradient-to-br from-sky-700 to-slate-950 text-6xl shadow-xl">
          🧒
        </div>

        <h2 className="mt-3 text-2xl font-black text-white">
          {child?.name || "Explorer"}
        </h2>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="rounded-full border border-yellow-500 bg-yellow-700/40 px-3 py-1 text-xs font-black text-yellow-100">
            Level {level}
          </span>

          <span className="rounded-full border border-orange-500 bg-orange-700/40 px-3 py-1 text-xs font-black text-orange-100">
            {rank}
          </span>
        </div>

        <p className="mt-3 text-sm font-bold text-yellow-300">
          ⭐ {points} XP
        </p>
      </div>

      <nav className="space-y-2 p-3">
  {links.map((link) => (
    <Link
      key={link.label}
      href={link.href}
      className="relative flex h-20 w-full items-center gap-4 px-8"
    >
      {link.active && (
        <img
          src="/images/pirate/dashboard-plank.png"
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
        />
      )}

      <span className="relative z-10 text-3xl">
        {link.icon}
      </span>

      <span
  className={`relative z-10 text-xl font-black ${
          link.active
            ? "text-yellow-100"
            : "text-yellow-200"
        }`}
      >
        {link.label}
      </span>
    </Link>
  ))}
</nav>
      <div className="mt-auto p-4">
        <button className="w-full rounded-xl border-2 border-yellow-700 bg-slate-900 px-3 py-3 text-xs font-black text-yellow-200 shadow hover:bg-yellow-900/40">
          🧭 CHANGE THEME
        </button>
      </div>
    </aside>
  );
}