import Sidebar from "@/components/Sidebar";

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

export default function AchievementsPage() {
  const unlockedCount = achievements.filter(
    (achievement) => achievement.status === "Unlocked"
  ).length;

  const lockedCount = achievements.length - unlockedCount;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
                Trophy Room
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                Achievements 🏆
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Celebrate progress, streaks, rewards and big family milestones.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-sm font-black text-yellow-300 shadow-xl">
              {unlockedCount} Unlocked
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="🏆" label="Achievements" value={achievements.length} />
            <StatCard icon="✅" label="Unlocked" value={unlockedCount} green />
            <StatCard icon="🔒" label="Locked" value={lockedCount} orange />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => {
              const unlocked = achievement.status === "Unlocked";

              return (
                <div
                  key={achievement.title}
                  className={`rounded-3xl border p-6 shadow-xl transition hover:-translate-y-1 ${
                    unlocked
                      ? "border-yellow-400/20 bg-white/10 hover:border-yellow-300/40"
                      : "border-white/10 bg-white/5 opacity-60"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
                        unlocked
                          ? "bg-yellow-400/10 ring-1 ring-yellow-400/20"
                          : "bg-white/10 ring-1 ring-white/10"
                      }`}
                    >
                      {achievement.icon}
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        unlocked
                          ? "border border-green-400/20 bg-green-500/10 text-green-300"
                          : "border border-orange-400/20 bg-orange-500/10 text-orange-300"
                      }`}
                    >
                      {achievement.status}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-white">
                    {achievement.title}
                  </h2>

                  <p className="mt-2 text-slate-300">
                    {achievement.description}
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-bold text-slate-400">Progress</p>

                    <p
                      className={`mt-1 text-2xl font-black ${
                        unlocked ? "text-yellow-300" : "text-orange-300"
                      }`}
                    >
                      {unlocked ? "Complete" : "In Progress"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  green = false,
  orange = false,
}: {
  icon: string;
  label: string;
  value: number;
  green?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl">
      <div
        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
          green
            ? "bg-green-500/10 ring-1 ring-green-400/20"
            : orange
            ? "bg-orange-500/10 ring-1 ring-orange-400/20"
            : "bg-yellow-400/10 ring-1 ring-yellow-400/20"
        }`}
      >
        {icon}
      </div>

      <p className="text-sm font-bold text-slate-300">{label}</p>

      <h2 className="mt-2 text-3xl font-black text-white">{value}</h2>
    </div>
  );
}