"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";

export default function ChildPage() {
  const { theme } = useTheme();

  const [child, setChild] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => {
    loadChildPortal();
  }, []);

  async function loadChildPortal() {
    const { data: childData } = await supabase
      .from("children")
      .select("*")
      .limit(1)
      .single();

    if (childData) setChild(childData);

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("completed", false);

    setTasks(taskData || []);

    const { data: rewardData } = await supabase.from("rewards").select("*");

    setRewards(rewardData || []);
  }

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

          <div
            className={`mb-8 rounded-3xl border ${theme.border} ${theme.cardBg} p-8 shadow-sm`}
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className={`text-sm font-bold ${theme.mutedText}`}>
                  Welcome back
                </p>

                <h2 className="mt-1 text-4xl font-black">
                  {child?.name || "Child"} 👋
                </h2>

                <p className={`mt-2 ${theme.mutedText}`}>
                  You are doing amazing. Keep going!
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat
                  icon="⭐"
                  label="Points"
                  value={String(child?.points || 0)}
                />
                <MiniStat icon="🔥" label="Streak" value="3 Days" />
                <MiniStat icon="🏆" label="Rank" value="#1" />
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>Next reward progress</span>
                <span className={theme.primaryText}>
                  {child?.points || 0} / 200
                </span>
              </div>

              <div className={`h-4 overflow-hidden rounded-full ${theme.softBg}`}>
                <div
                  className={`h-full rounded-full ${theme.progress}`}
                  style={{
                    width: `${Math.min(((child?.points || 0) / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 text-3xl">
              <span>🏆</span>
              <span>⭐</span>
              <span>🎁</span>
              <span className="opacity-40">🔥</span>
              <span className="opacity-40">👑</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="mb-4 text-2xl font-black">Tasks 📋</h2>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    points={task.points}
                  />
                ))}
              </div>
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="mb-4 text-2xl font-black">Rewards Shop 🎁</h2>

              <div className="space-y-3">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    title={reward.title}
                    cost={reward.cost}
                    icon="🎁"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4 text-center`}>
      <div className="text-3xl">{icon}</div>
      <p className={`mt-1 text-xs font-bold ${theme.mutedText}`}>{label}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
}

function TaskCard({ title, points }: { title: string; points: number }) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-black">{title}</h3>
          <p className={theme.mutedText}>+{points} points</p>
        </div>

        <button className={`rounded-xl px-5 py-3 text-sm font-black ${theme.button}`}>
          ✅ Complete
        </button>
      </div>
    </div>
  );
}

function RewardCard({
  title,
  cost,
  icon,
}: {
  title: string;
  cost: number;
  icon: string;
}) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}
          >
            {icon}
          </div>

          <div>
            <h3 className="font-black">{title}</h3>
            <p className={theme.mutedText}>{cost} points</p>
          </div>
        </div>

        <button className={`rounded-xl px-5 py-3 text-sm font-black ${theme.button}`}>
          🎁 Redeem
        </button>
      </div>
    </div>
  );
}