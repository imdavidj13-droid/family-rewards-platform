"use client";

import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";

const achievements = [
  {
    icon: "🏆",
    title: "First Task",
    description: "Complete your first task.",
    status: "Unlocked",
  },
  {
    icon: "⭐",
    title: "100 Points Club",
    description: "Reach 100 total points.",
    status: "Unlocked",
  },
  {
    icon: "🔥",
    title: "7 Day Streak",
    description: "Earn points 7 days in a row.",
    status: "Locked",
  },
  {
    icon: "🎁",
    title: "First Reward",
    description: "Request your first reward.",
    status: "Unlocked",
  },
  {
    icon: "💪",
    title: "Task Champion",
    description: "Complete 10 tasks.",
    status: "Locked",
  },
  {
    icon: "👑",
    title: "Family Champion",
    description: "Have the most points in the family.",
    status: "Locked",
  },
];

const achievementProgress = {
  "First Task": 100,
  "100 Points Club": 100,
  "7 Day Streak": 43,
  "First Reward": 100,
  "Task Champion": 60,
  "Family Champion": 20,
};

const categoryStats = [
  { icon: "📜", label: "Quests", value: 2 },
  { icon: "🔥", label: "Streaks", value: 1 },
  { icon: "🎁", label: "Rewards", value: 1 },
  { icon: "👑", label: "Legend", value: 2 },
];

export default function AchievementsPage() {
  const { theme } = useTheme();

  const unlockedCount = achievements.filter(
    (achievement) => achievement.status === "Unlocked"
  ).length;

  const lockedCount = achievements.length - unlockedCount;
  const completionPercent = Math.round(
    (unlockedCount / achievements.length) * 100
  );
  const nextMilestone =
    completionPercent >= 75 ? "Legendary Captain" : "Treasure Hunter";

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section
          className="min-w-0 flex-1 overflow-hidden px-3 pb-8 pt-3 sm:px-5 md:p-8"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 248, 220, 0.88), rgba(255, 248, 220, 0.92)), url('/images/pirate/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <section className="relative mb-5 overflow-hidden rounded-[2rem] border-4 border-yellow-900 bg-yellow-100 text-slate-950 shadow-2xl">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('/treasure-map.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-300/50 blur-3xl" />
            <div className="relative z-10 grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
              <div className="min-w-0">
                <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border-2 border-yellow-800 bg-red-700 px-3 py-2 text-xs font-black uppercase tracking-wide text-yellow-100 shadow sm:px-4">
                  <span>🏴‍☠️</span>
                  <span className="truncate">Captain&apos;s achievement journal</span>
                </div>

                <h1 className="break-words text-4xl font-black uppercase tracking-tight text-amber-950 sm:text-5xl lg:text-6xl">
                  Treasure Badges
                </h1>

                <p className="mt-3 max-w-2xl text-base font-bold leading-relaxed text-slate-800 sm:text-lg">
                  Complete family quests, collect glittering badges, and fill
                  your pirate journal with legendary wins.
                </p>
              </div>

              <div className="mx-auto flex w-full max-w-xs items-center justify-center lg:max-w-none">
                <div
                  className="relative flex min-h-44 w-full items-center justify-center bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/images/pirate/treasure-sign.png')",
                  }}
                >
                  <div className="px-8 pt-3 text-center">
                    <p className="text-xs font-black uppercase text-yellow-100">
                      Badge Loot
                    </p>
                    <h2 className="mt-1 text-5xl font-black text-yellow-300">
                      {unlockedCount}/{achievements.length}
                    </h2>
                    <p className="mt-1 text-xs font-black uppercase text-yellow-100">
                      Unlocked Relics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-[2rem] border-4 border-yellow-900 bg-yellow-100 p-4 text-slate-950 shadow-xl sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-amber-900">
                      Adventure Progress
                    </p>
                    <h2 className="mt-1 break-words text-3xl font-black text-amber-950 sm:text-4xl">
                      {completionPercent}% of the map conquered
                    </h2>
                  </div>

                  <div className="w-fit rounded-full border-2 border-yellow-800 bg-yellow-200 px-4 py-2 text-sm font-black text-amber-950">
                    🧭 Next: {nextMilestone}
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-full border-2 border-yellow-800 bg-yellow-300 p-1 shadow-inner">
                  <div
                    className="h-5 rounded-full bg-gradient-to-r from-red-700 via-orange-500 to-yellow-400 shadow"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <ProgressMarker active icon="⚓" label="Set Sail" />
                  <ProgressMarker
                    active={completionPercent >= 50}
                    icon="🪙"
                    label="Half Chest"
                  />
                  <ProgressMarker
                    active={completionPercent === 100}
                    icon="👑"
                    label="Legend"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
                <JournalStat icon="🏆" label="Total" value={achievements.length} />
                <JournalStat icon="✨" label="Won" value={unlockedCount} />
                <JournalStat icon="🔒" label="Hidden" value={lockedCount} />
              </div>
            </div>
          </section>

          <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categoryStats.map((category) => (
              <div
                key={category.label}
                className="rounded-3xl border-4 border-yellow-800 bg-yellow-50 p-4 text-center text-slate-950 shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-yellow-700 bg-yellow-200 text-3xl shadow">
                  {category.icon}
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-wide text-amber-900">
                  {category.label}
                </p>
                <p className="mt-1 text-2xl font-black text-amber-950">
                  {category.value}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-[2rem] border-4 border-yellow-900 bg-yellow-100 p-4 text-slate-950 shadow-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-amber-900">
                  Collectible Treasure Badges
                </p>
                <h2 className="text-3xl font-black text-amber-950">
                  Achievement Journal
                </h2>
              </div>
              <p className="text-sm font-bold text-slate-700">
                Tap each card with your eyes, matey — the next badge is close!
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {achievements.map((achievement) => {
                const unlocked = achievement.status === "Unlocked";
                const progress = achievementProgress[
                  achievement.title as keyof typeof achievementProgress
                ];

                return (
                  <AchievementBadge
                    key={achievement.title}
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    status={achievement.status}
                    progress={progress}
                    unlocked={unlocked}
                  />
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function JournalStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border-2 border-yellow-800 bg-yellow-50 p-3 text-center shadow sm:p-4">
      <div className="text-2xl sm:text-3xl">{icon}</div>
      <p className="mt-1 truncate text-[11px] font-black uppercase tracking-wide text-amber-900 sm:text-xs">
        {label}
      </p>
      <p className="text-2xl font-black text-amber-950 sm:text-3xl">{value}</p>
    </div>
  );
}

function ProgressMarker({
  active,
  icon,
  label,
}: {
  active: boolean;
  icon: string;
  label: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-3 text-center shadow ${
        active
          ? "border-yellow-800 bg-yellow-50 text-amber-950"
          : "border-stone-400 bg-stone-200 text-stone-500"
      }`}
    >
      <div className="text-2xl">{active ? icon : "☁️"}</div>
      <p className="mt-1 text-xs font-black uppercase tracking-wide">{label}</p>
    </div>
  );
}

function AchievementBadge({
  icon,
  title,
  description,
  status,
  progress,
  unlocked,
}: {
  icon: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  unlocked: boolean;
}) {
  return (
    <article
      className={`group relative min-w-0 overflow-hidden rounded-3xl border-4 p-4 shadow-xl transition sm:p-5 ${
        unlocked
          ? "border-yellow-700 bg-yellow-50 hover:-translate-y-1 hover:shadow-2xl"
          : "border-stone-500 bg-stone-200 grayscale hover:grayscale-0"
      }`}
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "url('/images/pirate/dashboard-plank.png'), url('/dashboard-plank.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {!unlocked && (
        <div className="absolute inset-x-3 top-3 z-10 rounded-2xl border-2 border-stone-500 bg-stone-100/90 px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-stone-600 shadow">
          Mystery parchment sealed 🔒
        </div>
      )}

      <div className={`relative z-20 ${unlocked ? "" : "pt-12 opacity-75"}`}>
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 text-4xl shadow-lg sm:h-24 sm:w-24 sm:text-5xl ${
              unlocked
                ? "border-yellow-500 bg-gradient-to-br from-yellow-200 to-amber-500"
                : "border-stone-500 bg-stone-100"
            }`}
          >
            {unlocked ? icon : "❔"}
          </div>

          <div
            className={`min-w-0 rounded-full px-3 py-1 text-xs font-black uppercase shadow ${
              unlocked
                ? "bg-red-700 text-yellow-100"
                : "bg-stone-500 text-stone-100"
            }`}
          >
            {status}
          </div>
        </div>

        <h3 className="mt-5 break-words text-2xl font-black text-amber-950">
          {title}
        </h3>
        <p className="mt-2 min-h-12 break-words text-sm font-bold leading-relaxed text-slate-700">
          {description}
        </p>

        <div className="mt-5 rounded-2xl border-2 border-yellow-700 bg-yellow-100 p-3 shadow-inner">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-amber-900">
              {unlocked ? "Treasure claimed" : "Map progress"}
            </p>
            <p className="shrink-0 text-sm font-black text-amber-950">
              {progress}%
            </p>
          </div>

          <div className="mt-2 overflow-hidden rounded-full bg-yellow-300">
            <div
              className={`h-3 rounded-full ${
                unlocked
                  ? "bg-gradient-to-r from-red-700 to-yellow-500"
                  : "bg-stone-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-xs font-black text-slate-700">
            {unlocked
              ? "Gold stamped in the captain’s log."
              : "Keep questing to reveal this badge."}
          </p>
        </div>
      </div>
    </article>
  );
}
