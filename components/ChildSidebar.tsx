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
  { href: "/child", label: "Dashboard", icon: "/images/pirate/icons/home.png", active: true },
  { href: "/child#quests", label: "Quests", icon: "/images/pirate/icons/quest-map.png" },
  { href: "/child#shop", label: "Reward Shop", icon: "🎁" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
  { href: "/children", label: "My Crew", icon: "👨‍👩‍👧" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

  return (
    <aside
  className="flex min-h-screen w-80 shrink-0 flex-col overflow-hidden border-r-4 border-yellow-900 text-yellow-100 shadow-2xl"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.32)), url('/images/pirate/sidebar-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="px-4 py-3 text-center">
        <div className="rounded-xl border-2 border-yellow-600 bg-red-800 px-3 py-2 shadow-xl">
          <p className="text-sm font-black leading-none text-yellow-100">
            FAMILY
          </p>
          <p className="text-sm font-black leading-none text-yellow-300">
            REWARDS
          </p>
        </div>
      </div>

      <div className="border-y-2 border-cyan-900/50 bg-black/20 px-4 py-5 text-center shadow-inner">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-500 bg-gradient-to-br from-sky-600 via-sky-900 to-slate-950 text-6xl shadow-xl">
          🧒
        </div>

        <h2 className="mt-3 text-2xl font-black text-white drop-shadow">
          {child?.name || "Explorer"}
        </h2>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="rounded-full border border-yellow-500 bg-black/40 px-2.5 py-1 text-[10px] font-black text-yellow-100 shadow">
            Level {level}
          </span>

          <span className="rounded-full border border-orange-500 bg-black/40 px-2.5 py-1 text-[10px] font-black text-orange-100 shadow">
            {rank}
          </span>
        </div>

        <p className="mt-3 text-xs font-black text-yellow-300 drop-shadow">
          ⭐ {points} XP
        </p>
      </div>

      <nav className="flex-1 py-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
className="group relative flex h-24 w-full items-center justify-center overflow-visible transition-transform hover:scale-[1.03]"          >
            <img
  src={
    link.active
      ? "/images/pirate/dashboard-plank.png"
      : "/images/pirate/dashboard-plank-dark.png"
  }
  alt=""
className="absolute left-1/2 top-1/2 h-[205px] w-[94%] -translate-x-1/2 -translate-y-1/2 object-fill"
/>

            <div className="relative z-10 flex w-12 justify-center">
  {typeof link.icon === "string" && link.icon.startsWith("/") ? (
    <img
      src={link.icon}
      alt=""
      className="h-10 w-10 object-contain"
    />
  ) : (
    <span className="text-3xl drop-shadow">
      {link.icon}
    </span>
  )}
</div>


            <span
              className={`relative z-10 text-2xl font-black leading-tight drop-shadow ${
                link.active ? "text-white" : "text-yellow-200"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <button className="w-full rounded-xl border-2 border-yellow-600 bg-black/50 px-3 py-3 text-xs font-black text-yellow-200 shadow-xl transition hover:bg-yellow-900/50 hover:text-yellow-100">
          🧭 CHANGE THEME
        </button>
      </div>
    </aside>
  );
}