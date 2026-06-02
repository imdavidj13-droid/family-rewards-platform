"use client";

import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";

export default function ChildPage() {
  const { theme } = useTheme();

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">
              Child Portal 👦
            </h1>

            <p className={`mt-2 ${theme.mutedText}`}>
              Complete tasks, earn points and claim rewards.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <div className="text-4xl">⭐</div>
              <p className={`mt-2 ${theme.mutedText}`}>Points</p>
              <h2 className="text-4xl font-black">125</h2>
            </div>

            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <div className="text-4xl">🏆</div>
              <p className={`mt-2 ${theme.mutedText}`}>Rank</p>
              <h2 className="text-4xl font-black">#1</h2>
            </div>

            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <div className="text-4xl">🔥</div>
              <p className={`mt-2 ${theme.mutedText}`}>Streak</p>
              <h2 className="text-4xl font-black">3 Days</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <h2 className="mb-4 text-2xl font-black">
                Tasks 📋
              </h2>

              <div className="space-y-3">
                <TaskCard title="Make Bed" points={5} />
                <TaskCard title="Brush Teeth" points={2} />
                <TaskCard title="Tidy Room" points={10} />
              </div>
            </div>

            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <h2 className="mb-4 text-2xl font-black">
                Rewards Shop 🎁
              </h2>

              <div className="space-y-3">
                <RewardCard title="Pick a Sweet" cost={20} />
                <RewardCard title="30 Minutes Gaming" cost={50} />
                <RewardCard title="Bowling With Dad" cost={500} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TaskCard({
  title,
  points,
}: {
  title: string;
  points: number;
}) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-between rounded-2xl ${theme.softBg} p-4`}>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className={theme.mutedText}>+{points} points</p>
      </div>

      <button className={`rounded-xl px-4 py-2 font-bold ${theme.button}`}>
        Complete
      </button>
    </div>
  );
}

function RewardCard({
  title,
  cost,
}: {
  title: string;
  cost: number;
}) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-between rounded-2xl ${theme.softBg} p-4`}>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className={theme.mutedText}>{cost} points</p>
      </div>

      <button className={`rounded-xl px-4 py-2 font-bold ${theme.button}`}>
        Redeem
      </button>
    </div>
  );
}