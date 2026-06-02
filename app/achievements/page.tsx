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

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Achievements 🏆
              </h1>

              <p className="mt-2 text-gray-500">
                Celebrate progress, streaks, rewards and big milestones.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
              {unlockedCount} Unlocked
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="🏆" label="Achievements" value={achievements.length} />
            <StatCard icon="✅" label="Unlocked" value={unlockedCount} />
            <StatCard
              icon="🔒"
              label="Locked"
              value={achievements.length - unlockedCount}
              orange
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => {
              const unlocked = achievement.status === "Unlocked";

              return (
                <div
                  key={achievement.title}
                  className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                    unlocked ? "hover:border-red-200" : "opacity-70"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl">
                      {achievement.icon}
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        unlocked
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {achievement.status}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900">
                    {achievement.title}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {achievement.description}
                  </p>

                  <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-500">Progress</p>

                    <p className="mt-1 text-2xl font-black text-red-600">
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
  orange = false,
}: {
  icon: string;
  label: string;
  value: number;
  orange?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${
          orange ? "bg-orange-100" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>

      <h2 className="mt-2 text-3xl font-black text-gray-900">{value}</h2>
    </div>
  );
}