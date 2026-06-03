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
      className="relative flex w-full shrink-0 flex-col overflow-hidden border-b-4 border-[#5b2a0b] text-yellow-100 shadow-2xl lg:min-h-screen lg:w-72 xl:w-80 lg:border-b-0 lg:border-r-4"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(2, 17, 27, 0.68), rgba(2, 17, 27, 0.96)), url('/images/pirate/sidebar-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:18px_100%] opacity-20" />

      <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-3 border-b border-cyan-950/70 bg-black/25 px-3 py-3 shadow-inner sm:grid-cols-[auto_auto_1fr] sm:px-4 lg:block lg:px-5 lg:py-6 lg:text-center">
        <div className="relative rounded-xl border-2 border-[#d99b20] bg-gradient-to-b from-red-700 to-red-950 px-3 py-2 text-center shadow-[0_5px_0_#3a1208] lg:mx-auto lg:mb-5 lg:w-40 lg:rotate-[-2deg]">
          <div className="absolute -inset-1 rounded-xl border border-yellow-200/30" />
          <p className="text-xs font-black leading-none tracking-wide text-yellow-100 sm:text-sm lg:text-lg">
            FAMILY
          </p>
          <p className="text-xs font-black leading-none tracking-wide text-yellow-300 sm:text-sm lg:text-lg">
            REWARDS
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:block">
          <div className="relative shrink-0 lg:mx-auto lg:w-fit">
            <div className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-md" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#d99b20] bg-gradient-to-br from-sky-500 via-sky-900 to-slate-950 text-4xl shadow-xl sm:h-20 sm:w-20 sm:text-5xl lg:h-32 lg:w-32 lg:text-6xl">
              🧒
            </div>
          </div>

          <div className="min-w-0 lg:mt-4">
            <h2 className="truncate text-xl font-black uppercase text-white drop-shadow sm:text-2xl">
              {child?.name || "Explorer"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2 lg:justify-center">
              <span className="rounded-full border border-yellow-500 bg-black/50 px-2.5 py-1 text-[10px] font-black uppercase text-yellow-100 shadow">
                Level {level}
              </span>

              <span className="rounded-full border border-orange-500 bg-black/50 px-2.5 py-1 text-[10px] font-black uppercase text-orange-100 shadow">
                {rank}
              </span>
            </div>

            <p className="mt-2 text-xs font-black uppercase tracking-wide text-yellow-300 drop-shadow">
              🪙 {points.toLocaleString()} Doubloons
            </p>
          </div>
        </div>

        <div className="hidden justify-self-end sm:block lg:hidden">
          <button className="rounded-xl border-2 border-yellow-600 bg-black/50 px-3 py-3 text-xs font-black uppercase text-yellow-200 shadow-xl transition hover:bg-yellow-900/50 hover:text-yellow-100">
            🧭 Theme
          </button>
        </div>
      </div>

      <nav className="relative z-10 flex gap-2 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:py-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`group relative flex min-w-[136px] items-center gap-2 rounded-2xl border-2 px-3 py-3 shadow-lg transition hover:-translate-y-0.5 sm:min-w-[150px] lg:h-[76px] lg:w-full lg:min-w-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-12 lg:py-0 lg:shadow-none ${
              link.active
                ? "border-yellow-500 bg-gradient-to-b from-[#a95718] to-[#5b2a0b]"
                : "border-[#6d390f] bg-black/35 hover:bg-black/50"
            }`}
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
              className="absolute left-1/2 top-1/2 hidden h-[178px] w-[95%] -translate-x-1/2 -translate-y-1/2 object-fill drop-shadow-xl lg:block"
            />

            <div className="relative z-10 flex shrink-0 justify-center rounded-xl bg-black/10 lg:-ml-4 lg:w-12 lg:bg-transparent">
              <Image
                src={link.icon}
                alt=""
                width={40}
                height={40}
                className="h-8 w-8 object-contain drop-shadow sm:h-10 sm:w-10"
              />
            </div>

            <span
              className={`relative z-10 text-sm font-black leading-tight drop-shadow sm:text-base lg:ml-3 lg:text-lg xl:text-xl ${
                link.active ? "text-white" : "text-yellow-200 group-hover:text-yellow-100"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="relative z-10 hidden px-4 pb-6 lg:block">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#6d390f] bg-black/30 text-6xl shadow-inner">
          ☸️
        </div>
        <button className="w-full rounded-xl border-2 border-[#d99b20] bg-black/55 px-3 py-3 text-xs font-black uppercase tracking-wide text-yellow-200 shadow-xl transition hover:bg-yellow-900/50 hover:text-yellow-100">
          🧭 Change Theme
        </button>
      </div>
    </aside>
  );
}
