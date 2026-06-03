"use client";

import { useEffect, useState } from "react";
import ChildSidebar from "@/components/ChildSidebar";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";
import { useRealtime } from "@/hooks/useRealtime";

type Child = {
  id: string;
  name?: string;
  points?: number;
};

type Task = {
  id: string;
  title: string;
  points: number;
};

type Reward = {
  id: string;
  title: string;
  cost: number;
};

type PendingReward = {
  id: string;
  status: string;
  created_at: string;
  child_id: string;
  reward_id: string;
  rewards?:
    | {
        title: string;
        cost: number;
      }
    | {
        title: string;
        cost: number;
      }[]
    | null;
};

export default function ChildPage() {
  const { theme } = useTheme();

  const [child, setChild] = useState<Child | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pendingRewards, setPendingRewards] = useState<PendingReward[]>([]);
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

    if (!childData) return;

    setChild(childData);

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("completed", false);

    setTasks(taskData || []);

    const { data: rewardData } = await supabase.from("rewards").select("*");

    setRewards(rewardData || []);

    const { data: pendingData } = await supabase
      .from("redemptions")
      .select(
        `
        id,
        status,
        created_at,
        child_id,
        reward_id,
        rewards (
          title,
          cost
        )
      `
      )
      .eq("child_id", childData.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setPendingRewards((pendingData || []) as PendingReward[]);
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
        points: (child.points || 0) + points,
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

  const points = child?.points || 0;
  const xpRemainder = points % 100;
  const xpProgress = Math.min((xpRemainder / 100) * 100, 100);
  const xpUntilNextLevel = xpRemainder === 0 ? 100 : 100 - xpRemainder;

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ChildSidebar child={child} />

        <section className="min-w-0 flex-1 overflow-hidden px-3 pb-6 pt-3 sm:px-5 md:p-8">
          {/* Adventure Hero */}
          <section
            className="relative -mx-3 -mt-3 mb-5 overflow-hidden shadow-2xl sm:-mx-5 md:-mx-8 md:-mt-8 md:mb-6"
            style={{
              backgroundImage: "url('/images/pirate/hero-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-5 md:grid-cols-[minmax(0,1fr)_240px] md:p-8 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border-4 border-yellow-800 bg-yellow-100/95 p-4 text-slate-950 shadow-2xl sm:p-6 md:min-h-[320px] md:border-0 md:bg-contain md:bg-left md:bg-no-repeat md:p-0 md:shadow-none">
                <div
                  className="pointer-events-none absolute inset-0 hidden bg-contain bg-left bg-no-repeat md:block"
                  style={{
                    backgroundImage: "url('/images/pirate/hero-scroll.png')",
                  }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left md:absolute md:left-10 md:top-10 lg:left-14 lg:top-12 lg:gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-yellow-600 bg-gradient-to-br from-sky-700 to-slate-950 text-5xl shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32 md:text-6xl xl:h-40 xl:w-40 xl:text-7xl">
                    🧒
                  </div>

                  <div className="max-w-md">
                    <p className="text-lg font-black text-amber-900 sm:text-xl md:text-2xl">
                      Ahoy there,
                    </p>

                    <h1 className="mt-1 break-words text-4xl font-black uppercase tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                      {child?.name || "Explorer"}!
                    </h1>

                    <p className="mt-3 text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">
                      You&apos;re doing great, Captain!
                    </p>

                    <p className="text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">
                      Keep up the good work! 🏴‍☠️
                    </p>
                  </div>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-xs items-center justify-center md:max-w-none md:justify-end xl:translate-x-8">
                <div
                  className="relative flex min-h-40 w-full max-w-[250px] items-center justify-center bg-contain bg-center bg-no-repeat sm:min-h-52 md:min-h-[300px] md:max-w-[300px] xl:min-h-[360px] xl:max-w-[360px]"
                  style={{
                    backgroundImage: "url('/images/pirate/treasure-sign.png')",
                  }}
                >
                  <div className="flex flex-col items-center justify-center px-8 pt-4 text-center">
                    <p className="text-[10px] font-black uppercase text-yellow-100 sm:text-xs md:text-sm">
                      Your Treasure
                    </p>

                    <h2 className="mt-1 text-4xl font-black text-yellow-300 sm:text-5xl md:text-6xl">
                      {points}
                    </h2>

                    <p className="mt-1 text-[10px] font-black uppercase text-yellow-100 sm:text-xs md:text-sm">
                      🪙 Gold Doubloons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Adventure Stats */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl sm:p-5">
              <p className="text-center text-xs font-black uppercase tracking-wide text-amber-900">
                Captain Level
              </p>

              <div className="mt-3 flex items-center gap-3 sm:gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-red-900 bg-red-700 text-4xl shadow sm:h-20 sm:w-20 sm:text-5xl">
                  ⚓
                </div>

                <div className="min-w-0">
                  <h2 className="text-3xl font-black sm:text-4xl">Level 7</h2>
                  <p className="font-black text-slate-700">First Mate</p>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-yellow-300">
                <div
                  className="h-full rounded-full bg-red-600"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>

              <p className="mt-2 text-center text-xs font-black text-slate-700">
                {xpUntilNextLevel} XP until Level 8
              </p>
            </div>

            <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-center text-slate-950 shadow-xl sm:p-5">
              <p className="text-xs font-black uppercase tracking-wide text-amber-900">
                Your Treasure
              </p>

              <div className="mt-4 text-5xl sm:text-6xl">🪙</div>

              <h2 className="mt-3 break-words text-4xl font-black sm:text-5xl">
                {points}
              </h2>

              <p className="font-black text-slate-700">Gold Doubloons</p>
            </div>

            <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-center text-slate-950 shadow-xl sm:col-span-2 sm:p-5 xl:col-span-1">
              <p className="text-xs font-black uppercase tracking-wide text-amber-900">
                Daily Streak
              </p>

              <div className="mt-4 text-5xl sm:text-6xl">🔥</div>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">3</h2>

              <p className="font-black text-slate-700">Days in a row!</p>

              <div className="mt-4 flex justify-center gap-2">
                <span className="h-4 w-4 rounded-full bg-orange-500" />
                <span className="h-4 w-4 rounded-full bg-orange-500" />
                <span className="h-4 w-4 rounded-full bg-orange-500" />
                <span className="h-4 w-4 rounded-full bg-yellow-300" />
                <span className="h-4 w-4 rounded-full bg-yellow-300" />
              </div>
            </div>
          </section>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,450px)_minmax(0,1fr)]">
            <section
              id="quests"
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-4 shadow-sm sm:p-6`}
            >
              <h2 className="mb-4 text-2xl font-black text-amber-900">
                📜 Quest Board
              </h2>

              {tasks.length === 0 ? (
                <div className="rounded-2xl border-2 border-yellow-800 bg-yellow-50 p-5 text-center sm:p-6">
                  <div className="text-5xl sm:text-6xl">🏴‍☠️</div>

                  <h3 className="mt-4 text-2xl font-black text-amber-900">
                    Quest Complete!
                  </h3>

                  <p className="mt-2 font-medium text-slate-700">
                    You&apos;ve finished every quest for today.
                  </p>

                  <div className="mt-4 inline-block rounded-full bg-green-600 px-4 py-2 font-black text-white">
                    + Adventure Bonus
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4 shadow"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-2xl text-white">
                            {getQuestIcon(task.title)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words font-black text-slate-950">
                              {task.title}
                            </h3>

                            <p className="text-sm font-black text-amber-900">
                              ⭐ +{task.points} XP
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => completeTask(task.id, task.points)}
                          className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-700 sm:w-auto sm:py-2"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section
              className={`min-w-0 rounded-3xl border ${theme.border} ${theme.cardBg} p-4 shadow-sm sm:p-6`}
            >
              <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 shadow-xl sm:p-6">
                <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
                  🗺️ Your Adventure
                </h2>

                <div className="rounded-2xl border-2 border-yellow-700 bg-sky-200 p-4 sm:p-8">
                  <div className="text-center text-6xl sm:text-7xl">⛵</div>

                  <div className="mt-8 overflow-x-auto pb-2">
                    <div className="flex min-w-max items-center justify-between">
                      <AdventureLevel badge="⚓" label="Level 5" tone="bg-green-600" />
                      <div className="h-1 w-12 flex-1 bg-yellow-600 sm:w-auto" />
                      <AdventureLevel badge="⚓" label="Level 6" tone="bg-blue-600" />
                      <div className="h-1 w-12 flex-1 bg-yellow-600 sm:w-auto" />
                      <AdventureLevel
                        badge="⭐"
                        label="Level 7"
                        tone="border-4 border-yellow-400 bg-red-600"
                        featured
                      />
                      <div className="h-1 w-12 flex-1 bg-gray-400 sm:w-auto" />
                      <AdventureLevel
                        badge="🔒"
                        label="Level 8"
                        tone="bg-gray-500"
                        muted
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-yellow-200 p-3 text-center font-black text-amber-900">
                    You&apos;re on a roll, Captain! 🏴‍☠️
                  </div>
                </div>
              </div>

              <div
                id="shop"
                className="mt-6 rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 shadow-xl sm:p-6"
              >
                <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
                  🎁 Reward Shop
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {rewards.slice(0, 4).map((reward) => {
                    const isPending = pendingRewards.some(
                      (request) => request.reward_id === reward.id
                    );

                    return (
                      <div
                        key={reward.id}
                        className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4 text-center shadow sm:p-5"
                      >
                        <div className="text-6xl sm:text-7xl lg:text-8xl">
                          {getRewardIcon(reward.title)}
                        </div>

                        <h3 className="mt-4 break-words text-lg font-black text-slate-950 sm:text-xl">
                          {reward.title}
                        </h3>

                        <p className="mt-2 text-sm font-black text-amber-900">
                          🪙 {reward.cost} Doubloons
                        </p>

                        <button
                          onClick={() => redeemReward(reward.id)}
                          disabled={isPending}
                          className={`mt-4 w-full rounded-xl px-5 py-3 text-sm font-black text-white ${
                            isPending
                              ? "cursor-not-allowed bg-gray-400"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {isPending ? "Requested ⏳" : "Redeem"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
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

function AdventureLevel({
  badge,
  label,
  tone,
  featured = false,
  muted = false,
}: {
  badge: string;
  label: string;
  tone: string;
  featured?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`min-w-16 text-center ${muted ? "opacity-50" : ""}`}>
      <div
        className={`mx-auto flex ${
          featured ? "h-14 w-14" : "h-12 w-12"
        } items-center justify-center rounded-full text-white ${tone}`}
      >
        {badge}
      </div>
      <p className="mt-2 text-sm font-black">{label}</p>
    </div>
  );
}

function getQuestIcon(title: string) {
  const name = title.toLowerCase();

  if (name.includes("bed")) return "🛏️";
  if (name.includes("read")) return "📖";
  if (name.includes("teeth") || name.includes("brush")) return "🦷";
  if (name.includes("football")) return "⚽";
  if (name.includes("homework")) return "📚";
  if (name.includes("school")) return "🎒";
  if (name.includes("room")) return "🧹";
  if (name.includes("dish")) return "🍽️";
  if (name.includes("kind")) return "💛";
  if (name.includes("good")) return "⭐";

  return "📜";
}

function getRewardIcon(title: string) {
  const name = title.toLowerCase();

  if (name.includes("ps5")) return "🎮";
  if (name.includes("xbox")) return "🎮";
  if (name.includes("game")) return "🎮";
  if (name.includes("pizza")) return "🍕";
  if (name.includes("movie")) return "🎬";
  if (name.includes("cinema")) return "🎬";
  if (name.includes("sweet")) return "🍬";
  if (name.includes("ice cream")) return "🍦";
  if (name.includes("hot dog")) return "🌭";
  if (name.includes("being good")) return "⭐";
  if (name.includes("robux")) return "💎";
  if (name.includes("v-bucks")) return "🪙";
  if (name.includes("football")) return "⚽";

  return "🎁";
}
