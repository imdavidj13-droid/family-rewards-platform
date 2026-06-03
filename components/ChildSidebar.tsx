"use client";

import Image from "next/image";
import Link from "next/link";

type ChildSidebarProps = {
  child: {
    name?: string;
    points?: number;
  } | null;
};

export default function ChildSidebar({ child }: ChildSidebarProps) {
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
    {
      href: "/child",
      label: "Dashboard",
      icon: "/images/pirate/icons/home.png",
      active: true,
    },
    { href: "/child#quests", label: "Quests", icon: "/images/pirate/icons/map.png" },
    {
      href: "/child#shop",
      label: "Reward Shop",
      icon: "/images/pirate/icons/treasure-chest.png",
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: "/images/pirate/icons/trophy.png",
    },
    { href: "/children", label: "My Crew", icon: "/images/pirate/icons/crew.png" },
    { href: "/settings", label: "Settings", icon: "/images/pirate/icons/settings.png" },
  ];

  return (
    <aside
      className="flex w-full shrink-0 flex-col overflow-hidden border-b-4 border-yellow-900 text-yellow-100 shadow-2xl lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.32)), url('/images/pirate/sidebar-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 border-cyan-900/50 bg-black/20 px-3 py-3 shadow-inner sm:grid-cols-[auto_auto_1fr] sm:px-4 lg:block lg:border-y-2 lg:bg-transparent lg:text-center">
        <div className="rounded-xl border-2 border-yellow-600 bg-red-800 px-3 py-2 text-center shadow-xl lg:mb-3">
          <p className="text-xs font-black leading-none text-yellow-100 sm:text-sm">
            FAMILY
          </p>
          <p className="text-xs font-black leading-none text-yellow-300 sm:text-sm">
            REWARDS
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:block lg:px-4 lg:py-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-yellow-500 bg-gradient-to-br from-sky-600 via-sky-900 to-slate-950 text-4xl shadow-xl sm:h-20 sm:w-20 sm:text-5xl lg:mx-auto lg:h-32 lg:w-32 lg:text-6xl">
            🧒
          </div>

          <div className="min-w-0 lg:mt-3">
            <h2 className="truncate text-xl font-black text-white drop-shadow sm:text-2xl">
              {child?.name || "Explorer"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2 lg:justify-center">
              <span className="rounded-full border border-yellow-500 bg-black/40 px-2.5 py-1 text-[10px] font-black text-yellow-100 shadow">
                Level {level}
              </span>

              <span className="rounded-full border border-orange-500 bg-black/40 px-2.5 py-1 text-[10px] font-black text-orange-100 shadow">
                {rank}
              </span>
            </div>

            <p className="mt-2 text-xs font-black text-yellow-300 drop-shadow">
              ⭐ {points} XP
            </p>
          </div>
        </div>

        <div className="hidden justify-self-end sm:block lg:hidden">
          <button className="rounded-xl border-2 border-yellow-600 bg-black/50 px-3 py-3 text-xs font-black text-yellow-200 shadow-xl transition hover:bg-yellow-900/50 hover:text-yellow-100">
            🧭 Theme
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="group relative flex min-w-[132px] items-center gap-2 rounded-2xl border-2 border-yellow-700 bg-black/35 px-3 py-3 shadow-lg transition-transform hover:scale-[1.03] lg:h-24 lg:w-full lg:min-w-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-14 lg:py-0 lg:shadow-none"
          >
            <Image
              src={
                link.active
                  ? "/images/pirate/dashboard-plank.png"
                  : "/images/pirate/dashboard-plank-dark.png"
              }
              alt=""
              width={290}
              height={205}
              className="absolute left-1/2 top-1/2 hidden h-[205px] w-[94%] -translate-x-1/2 -translate-y-1/2 object-fill lg:block"
            />

            <div className="relative z-10 flex shrink-0 justify-center lg:-ml-5 lg:w-14">
              <Image
                src={link.icon}
                alt=""
                width={40}
                height={40}
                className="h-8 w-8 object-contain drop-shadow sm:h-10 sm:w-10"
              />
            </div>

            <span
              className={`relative z-10 text-sm font-black leading-tight drop-shadow sm:text-base lg:ml-3 lg:text-xl ${
                link.active ? "text-white" : "text-yellow-200"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="hidden p-4 lg:block">
        <button className="w-full rounded-xl border-2 border-yellow-600 bg-black/50 px-3 py-3 text-xs font-black text-yellow-200 shadow-xl transition hover:bg-yellow-900/50 hover:text-yellow-100">
          🧭 CHANGE THEME
        </button>
      </div>
    </aside>
  );
}
