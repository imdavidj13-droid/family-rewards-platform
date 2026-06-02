"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";
import { useRealtime } from "@/hooks/useRealtime";

export default function ChildPage() {
  const { theme } = useTheme();

  const [child, setChild] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [pendingRewards, setPendingRewards] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  
  useRealtime("children", loadChildPortal);
useRealtime("redemptions", loadChildPortal);
useRealtime("rewards", loadChildPortal);

  useEffect(() => {
    loadChildPortal();
  }, []);

  async function loadChildPortal() {
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login";
  return;
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("child_id")
  .eq("user_id", user.id)
  .single();

if (profileError || !profile?.child_id) {
  setToast({
    type: "error",
    message: "No child profile is linked to this account.",
  });
  return;
}

const { data: childData, error: childError } = await supabase
  .from("children")
  .select("*")
  .eq("id", profile.child_id)
  .single();

if (childError) {
  setToast({
    type: "error",
    message: childError.message,
  });
  return;
}

if (childData) {
  setChild(childData);
}

    if (childData) setChild(childData);

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("completed", false);

    setTasks(taskData || []);

    const { data: rewardData } = await supabase.from("rewards").select("*");

    setRewards(rewardData || []);

    const { data: pendingData } = await supabase
      .from("redemptions")
      .select(`
        id,
        status,
        created_at,
          reward_id,
        rewards (
          title,
          cost
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    setPendingRewards(pendingData || []);
  }

  async function completeTask(taskId: string, points: number) {
    if (!child) {
      setToast({ type: "error", message: "No child found." });
      return;
    }

    const { error: taskError } = await supabase
      .from("tasks")
      .update({ completed: true })
      .eq("id", taskId);

    if (taskError) {
      setToast({ type: "error", message: taskError.message });
      return;
    }

    const { error: childError } = await supabase
      .from("children")
      .update({
        points: child.points + points,
      })
      .eq("id", child.id);

    if (childError) {
      setToast({ type: "error", message: childError.message });
      return;
    }

    setToast({
      type: "success",
      message: `Task completed! +${points} points`,
    });

    loadChildPortal();
  }

  async function redeemReward(rewardId: string) {
  if (!child) {
    setToast({ type: "error", message: "No child found." });
    return;
  }

  const alreadyPending = pendingRewards.some(
    (request) => request.rewards && request.reward_id === rewardId
  );

  if (alreadyPending) {
    setToast({
      type: "info",
      message: "You've already requested this reward.",
    });
    return;
  }

  const { error } = await supabase.from("redemptions").insert({
    child_id: child.id,
    reward_id: rewardId,
    status: "pending",
  });

  if (error) {
    setToast({ type: "error", message: error.message });
    return;
  }

  setToast({
    type: "success",
    message: "Reward requested successfully!",
  });

  loadChildPortal();
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
                    width: `${Math.min(
                      ((child?.points || 0) / 200) * 100,
                      100
                    )}%`,
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

          <div className="grid items-start gap-6 xl:grid-cols-3">
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="mb-4 text-2xl font-black">Tasks 📋</h2>

              {tasks.length === 0 ? (
                <div className={`rounded-2xl ${theme.softBg} p-6 text-center`}>
                  <div className="text-5xl">🎉</div>

                  <h3 className="mt-3 text-xl font-black">
                    All tasks complete!
                  </h3>

                  <p className={`mt-2 ${theme.mutedText}`}>
                    Great job. Check back later for more tasks.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      points={task.points}
                      onComplete={completeTask}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="mb-4 text-2xl font-black">Rewards Shop 🎁</h2>

              <div className="space-y-3">
                {rewards.map((reward) => {
  const isPending = pendingRewards.some(
    (request) => request.reward_id === reward.id
  );

  return (
    <RewardCard
      key={reward.id}
      id={reward.id}
      title={reward.title}
      cost={reward.cost}
      icon="🎁"
      isPending={isPending}
      onRedeem={redeemReward}
    />
  );
})}
              </div>
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="mb-4 text-2xl font-black">Pending Rewards ⏳</h2>

              {pendingRewards.length === 0 ? (
                <p className={theme.mutedText}>No pending rewards.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRewards.map((request) => (
                    <div
                      key={request.id}
                      className={`flex items-center justify-between gap-4 rounded-2xl ${theme.softBg} p-4`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}
                        >
                          🎁
                        </div>

                        <div>
                          <h3 className="font-black">
                            {request.rewards?.title || "Reward"}
                          </h3>

                          <p className={theme.mutedText}>
                            Waiting for parent approval
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${theme.softAccentBg} ${theme.primaryText}`}
                      >
                        ⏳ Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
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

function TaskCard({
  id,
  title,
  points,
  onComplete,
}: {
  id: string;
  title: string;
  points: number;
  onComplete: (id: string, points: number) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-black">{title}</h3>
          <p className={theme.mutedText}>+{points} points</p>
        </div>

        <button
          onClick={() => onComplete(id, points)}
          className={`rounded-xl px-5 py-3 text-sm font-black ${theme.button}`}
        >
          ✅ Complete
        </button>
      </div>
    </div>
  );
}

function RewardCard({
  id,
  title,
  cost,
  icon,
  isPending,
  onRedeem,
}: {
  id: string;
  title: string;
  cost: number;
  icon: string;
  isPending: boolean;
  onRedeem: (id: string) => Promise<void>;
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

        <button
  onClick={() => onRedeem(id)}
  disabled={isPending}
  className={`rounded-xl px-5 py-3 text-sm font-black ${
    isPending
      ? "cursor-not-allowed bg-gray-200 text-gray-500"
      : theme.button
  }`}
>
  {isPending ? "Requested ⏳" : "🎁 Redeem"}
</button>
      </div>
    </div>
  );
}