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

export default function AchievementsPage() {
  const { theme } = useTheme();

  const unlockedCount = achievements.filter(
    (achievement) => achievement.status === "Unlocked"
  ).length;

  const lockedCount = achievements.length - unlockedCount;

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Achievements 🏆
              </h1>

              <p className={`mt-2 ${theme.mutedText}`}>
                Celebrate progress, streaks, rewards and big milestones.
              </p>
            </div>

            <div
              className={`rounded-xl border ${theme.border} ${theme.cardBg} px-4 py-2 text-sm font-bold ${theme.mutedText} shadow-sm`}
            >
              {unlockedCount} Unlocked
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard
              icon="🏆"
              label="Achievements"
              value={achievements.length}
            />

            <StatCard icon="✅" label="Unlocked" value={unlockedCount} />

            <StatCard icon="🔒" label="Locked" value={lockedCount} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => {
              const unlocked = achievement.status === "Unlocked";

              return (
                <div
                  key={achievement.title}
                  className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-4xl`}
                    >
                      {achievement.icon}
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${theme.softAccentBg} ${theme.primaryText}`}
                    >
                      {achievement.status}
                    </div>
                  </div>

                  <h2 className={`text-2xl font-black ${theme.text}`}>
                    {achievement.title}
                  </h2>

                  <p className={`mt-2 ${theme.mutedText}`}>
                    {achievement.description}
                  </p>

                  <div className={`mt-5 rounded-2xl ${theme.softBg} p-4`}>
                    <p className={`text-sm font-bold ${theme.mutedText}`}>
                      Progress
                    </p>

                    <p
                      className={`mt-1 text-2xl font-black ${theme.primaryText}`}
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
}: {
  icon: string;
  label: string;
  value: number;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-5 shadow-sm`}
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}
      >
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>

      <h2 className={`mt-2 text-3xl font-black ${theme.text}`}>{value}</h2>
    </div>
  );
}