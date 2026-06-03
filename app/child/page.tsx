"use client";

import { useEffect, useState } from "react";
import ChildSidebar from "@/components/ChildSidebar";
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
  const xpRemainder = points % 100;
  const xpProgress = Math.min((xpRemainder / 100) * 100, 100);
  const xpUntilNextLevel = xpRemainder === 0 ? 100 : 100 - xpRemainder;
  const completedMilestones = Math.max(level - 2, 1);
  const nextLevel = level + 1;
  const visibleRewards = rewards.slice(0, 4);
  const achievementBadges = [
    {
      icon: "⚓",
      title: "First Quest",
      description: tasks.length === 0 ? "All clear today!" : "Begin your voyage",
      unlocked: points > 0 || tasks.length === 0,
    },
    {
      icon: "🪙",
      title: "100 Gold",
      description: "Earn 100 XP",
      unlocked: points >= 100,
    },
    {
      icon: "🔥",
      title: "3 Day Streak",
      description: "Keep it going!",
      unlocked: true,
    },
    {
      icon: "🎁",
      title: "First Reward",
      description: pendingRewards.length > 0 ? "Reward requested" : "Find treasure",
      unlocked: pendingRewards.length > 0,
    },
    {
      icon: "🤝",
      title: "Helping Hand",
      description: "Help the crew",
      unlocked: points >= 250,
    },
    {
      icon: "🧭",
      title: "Superstar Week",
      description: "Complete the map",
      unlocked: points >= 500,
    },
  ];

  return (
    <main className="min-h-screen bg-[#1d1007] text-amber-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ChildSidebar child={child} />

        <section
          className="min-w-0 flex-1 overflow-hidden px-3 pb-24 pt-3 sm:px-5 md:p-7 lg:pb-8"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9, 25, 35, 0.08), rgba(43, 22, 9, 0.78)), url('/images/pirate/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <section className="relative -mx-3 -mt-3 mb-4 overflow-hidden border-b-4 border-[#4b250d] bg-sky-900 shadow-2xl sm:-mx-5 md:-mx-7 md:-mt-7 md:mb-5 md:rounded-b-[2rem] md:border-x-4">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/images/pirate/hero-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06131e]/50 via-transparent to-[#06131e]/25" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2a160a] to-transparent" />

              <div className="relative z-10 grid gap-4 px-3 py-5 sm:px-5 md:grid-cols-[minmax(0,1fr)_260px] md:p-7 xl:grid-cols-[minmax(0,1fr)_310px] xl:p-9">
                <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] border-4 border-[#6d390f] bg-[#f3d490] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:p-6 md:min-h-[340px] md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                  <div
                    className="pointer-events-none absolute inset-0 hidden bg-contain bg-left bg-no-repeat md:block"
                    style={{ backgroundImage: "url('/images/pirate/hero-scroll.png')" }}
                  />
                  <div className="pointer-events-none absolute -left-8 top-5 hidden h-64 w-10 rounded-full bg-[#7b4a1d] shadow-xl md:block" />

                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left md:absolute md:left-9 md:top-8 md:h-auto md:max-w-[680px] md:justify-start lg:left-12 xl:left-14 xl:top-10 xl:gap-6">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-full bg-yellow-400/45 blur-md" />
                      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-[#d99b20] bg-gradient-to-br from-sky-500 via-sky-800 to-[#071525] text-6xl shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:h-32 sm:w-32 md:h-36 md:w-36 xl:h-44 xl:w-44 xl:text-7xl">
                        🧒
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-[#5b2a0b] bg-red-800 px-3 py-1 text-[10px] font-black uppercase text-yellow-100 shadow-lg sm:text-xs">
                        {rank}
                      </div>
                    </div>

                    <div className="min-w-0 max-w-md">
                      <p className="text-xl font-black text-[#4d2b12] sm:text-2xl md:text-3xl">
                        Ahoy there,
                      </p>
                      <h1 className="mt-1 break-words text-5xl font-black uppercase leading-[0.92] tracking-tight text-[#13253a] drop-shadow-sm sm:text-6xl md:text-7xl xl:text-8xl">
                        {child?.name || "Explorer"}!
                      </h1>
                      <p className="mt-4 text-lg font-black leading-snug text-[#3a2515] sm:text-xl md:text-2xl">
                        You&apos;re doing great, Captain!
                      </p>
                      <p className="text-base font-bold leading-snug text-[#3a2515] sm:text-lg md:text-xl">
                        Keep sailing toward Level {nextLevel} and collect more treasure. 🏴‍☠️
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-[280px] items-center justify-center md:max-w-none md:justify-end xl:translate-x-4">
                  <div
                    className="relative flex min-h-48 w-full items-center justify-center bg-contain bg-center bg-no-repeat sm:min-h-56 md:min-h-[300px] xl:min-h-[350px]"
                    style={{ backgroundImage: "url('/images/pirate/treasure-sign.png')" }}
                  >
                    <div className="px-8 pt-3 text-center">
                      <p className="text-xs font-black uppercase tracking-wide text-yellow-100 md:text-sm">
                        Your Treasure
                      </p>
                      <h2 className="mt-1 text-5xl font-black text-yellow-300 drop-shadow md:text-6xl xl:text-7xl">
                        {points.toLocaleString()}
                      </h2>
                      <p className="mt-1 text-xs font-black uppercase text-yellow-100 md:text-sm">
                        🪙 Gold Doubloons
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <PirateStatCard
                icon="⚓"
                eyebrow="Captain Level"
                value={`Level ${level}`}
                detail={rank}
                progress={xpProgress}
                footer={`${xpUntilNextLevel} XP until Level ${nextLevel}`}
              />
              <PirateStatCard
                icon="🪙"
                eyebrow="Your Treasure"
                value={points.toLocaleString()}
                detail="Gold Doubloons"
                footer="Spend them in the reward shop"
              />
              <PirateStatCard
                icon="🔥"
                eyebrow="Daily Streak"
                value="3"
                detail="Days in a row!"
                footer="Keep the flame alive"
                dots={3}
              />
              <PirateStatCard
                icon="🧭"
                eyebrow="Progress"
                value={`${Math.round(xpProgress)}%`}
                detail={`Toward Level ${nextLevel}`}
                progress={xpProgress}
                footer={`${completedMilestones} map milestones cleared`}
              />
            </section>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,470px)_minmax(0,1fr)]">
              <PiratePanel id="quests" title="Today’s Quests" ribbon="red">
                {tasks.length === 0 ? (
                  <div className="rounded-2xl border-2 border-[#8a5218] bg-[#fff0c9] p-5 text-center shadow-inner sm:p-6">
                    <div className="text-6xl">🏴‍☠️</div>
                    <h3 className="mt-3 text-2xl font-black text-[#5b270d]">
                      Quest Board Cleared!
                    </h3>
                    <p className="mt-2 font-bold text-[#53351b]">
                      You&apos;ve finished every quest for today.
                    </p>
                    <div className="mt-4 inline-flex rounded-full border-2 border-green-900 bg-green-600 px-4 py-2 font-black text-white shadow">
                      ✓ Adventure Bonus Earned
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group rounded-2xl border-2 border-[#b97925] bg-gradient-to-r from-[#fff3cf] to-[#f4d494] p-3 shadow-[0_5px_0_#7a4314] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_#7a4314] sm:p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#8a5218] bg-[#f6d179] text-3xl shadow-inner">
                              {getQuestIcon(task.title)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="break-words text-lg font-black leading-tight text-[#2b180b]">
                                {task.title}
                              </h3>
                              <p className="mt-1 text-sm font-black text-[#7a320c]">
                                +{task.points} XP • Captain&apos;s quest
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => completeTask(task.id, task.points)}
                            className="w-full rounded-xl border-2 border-[#1f5f17] bg-gradient-to-b from-[#62bd3d] to-[#2f7f1f] px-4 py-3 text-sm font-black uppercase text-white shadow-[0_4px_0_#164d13] transition hover:translate-y-0.5 hover:shadow-[0_2px_0_#164d13] sm:w-auto"
                          >
                            ✓ Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PiratePanel>

              <div className="min-w-0 space-y-5">
                <PiratePanel title="Your Adventure" ribbon="blue">
                  <div className="relative overflow-hidden rounded-2xl border-4 border-[#8a5218] bg-sky-200 p-4 shadow-inner sm:p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_24%),radial-gradient(circle_at_75%_65%,rgba(18,104,145,0.3),transparent_22%)]" />
                    <div className="absolute inset-x-8 top-1/2 hidden border-t-4 border-dashed border-yellow-100/90 sm:block" />
                    <div className="relative z-10 mb-4 text-center text-6xl drop-shadow sm:text-7xl">⛵</div>
                    <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <AdventureLevel badge="⚓" label={`Level ${Math.max(level - 2, 1)}`} state="done" />
                      <AdventureLevel badge="⚓" label={`Level ${Math.max(level - 1, 1)}`} state="done" />
                      <AdventureLevel badge="🏴‍☠️" label={`Level ${level}`} state="current" />
                      <AdventureLevel badge="🔒" label={`Level ${nextLevel}`} state="locked" />
                    </div>
                    <div className="relative z-10 mt-6 rounded-xl border-2 border-[#9b5c1c] bg-[#f7d891] p-3 text-center font-black text-[#4b250d] shadow">
                      {xpUntilNextLevel} XP until the next island, Captain! 🗺️
                    </div>
                  </div>
                </PiratePanel>

                <PiratePanel id="shop" title="Reward Shop" ribbon="blue" action="View All">
                  {visibleRewards.length === 0 ? (
                    <div className="rounded-2xl border-2 border-[#8a5218] bg-[#fff0c9] p-6 text-center font-black text-[#5b270d]">
                      The treasure shop is waiting for new loot.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                      {visibleRewards.map((reward) => {
                        const isPending = pendingRewards.some(
                          (request) => request.reward_id === reward.id
                        );

                        return (
                          <div
                            key={reward.id}
                            className="flex min-h-[210px] flex-col rounded-2xl border-2 border-[#9b5c1c] bg-gradient-to-b from-[#fff2c8] to-[#e8b85f] p-3 text-center shadow-[0_5px_0_#6e3b12]"
                          >
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#b97925] bg-[#fff6d8] text-5xl shadow-inner">
                              {getRewardIcon(reward.title)}
                            </div>
                            <h3 className="mt-3 flex-1 break-words text-base font-black leading-tight text-[#241307]">
                              {reward.title}
                            </h3>
                            <div className="mt-3 rounded-lg border-2 border-[#7a320c] bg-red-800 px-2 py-2 text-sm font-black text-yellow-100 shadow">
                              🪙 {reward.cost.toLocaleString()}
                            </div>
                            <button
                              onClick={() => redeemReward(reward.id)}
                              disabled={isPending}
                              className={`mt-3 rounded-xl border-2 px-3 py-2 text-xs font-black uppercase text-white shadow transition ${
                                isPending
                                  ? "cursor-not-allowed border-slate-500 bg-slate-500"
                                  : "border-[#8a210d] bg-gradient-to-b from-red-600 to-red-800 hover:translate-y-0.5"
                              }`}
                            >
                              {isPending ? "Requested ⏳" : "Redeem"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </PiratePanel>
              </div>
            </div>

            <PiratePanel title="Recent Achievements" ribbon="red" action="View All" className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {achievementBadges.map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`rounded-2xl border-2 p-4 text-center shadow-[0_4px_0_rgba(91,39,13,0.8)] ${
                      achievement.unlocked
                        ? "border-[#b97925] bg-gradient-to-b from-[#fff0c9] to-[#e8be70]"
                        : "border-[#6d6253] bg-gradient-to-b from-[#e2d3b5] to-[#9f927d] opacity-75"
                    }`}
                  >
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 text-4xl shadow-inner ${achievement.unlocked ? "border-[#d99b20] bg-yellow-500" : "border-slate-500 bg-slate-400 grayscale"}`}>
                      {achievement.unlocked ? achievement.icon : "🔒"}
                    </div>
                    <h3 className="mt-3 text-sm font-black uppercase leading-tight text-[#2b180b]">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold leading-snug text-[#53351b]">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </PiratePanel>
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

function PiratePanel({
  id,
  title,
  ribbon,
  action,
  className = "",
  children,
}: {
  id?: string;
  title: string;
  ribbon: "red" | "blue";
  action?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ribbonTone =
    ribbon === "red"
      ? "from-red-900 via-red-700 to-red-900 border-[#5b1b0b] text-yellow-100"
      : "from-[#12324d] via-[#17486d] to-[#12324d] border-[#071d2d] text-yellow-100";

  return (
    <section
      id={id}
      className={`relative rounded-[1.75rem] border-4 border-[#5b2a0b] bg-gradient-to-b from-[#f5d99c] to-[#c88437] p-3 pt-8 shadow-[0_10px_0_#2d1609,0_20px_36px_rgba(0,0,0,0.35)] sm:p-5 sm:pt-10 ${className}`}
    >
      <div className="absolute left-1/2 top-0 z-10 flex w-[min(88%,340px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className={`w-full rounded-xl border-2 bg-gradient-to-b px-4 py-2 text-center shadow-[0_5px_0_rgba(45,22,9,0.65)] ${ribbonTone}`}>
          <h2 className="text-xl font-black uppercase tracking-wide drop-shadow sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      {action && (
        <div className="absolute right-3 top-3 hidden rounded-lg border-2 border-[#3a1b09] bg-[#5b2a0b] px-3 py-1 text-xs font-black uppercase text-yellow-100 shadow sm:block">
          {action}
        </div>
      )}

      <div className="rounded-[1.25rem] border-2 border-[#9b5c1c] bg-[#f7dfaa]/80 p-2 shadow-inner sm:p-3">
        {children}
      </div>
    </section>
  );
}

function PirateStatCard({
  icon,
  eyebrow,
  value,
  detail,
  progress,
  footer,
  dots,
}: {
  icon: string;
  eyebrow: string;
  value: string;
  detail: string;
  progress?: number;
  footer: string;
  dots?: number;
}) {
  return (
    <article className="rounded-[1.6rem] border-4 border-[#6d390f] bg-gradient-to-b from-[#fbe8b8] via-[#efd08e] to-[#d79a45] p-4 text-[#241307] shadow-[0_7px_0_#3a1b09,0_15px_28px_rgba(0,0,0,0.25)] sm:p-5">
      <p className="text-center text-xs font-black uppercase tracking-wide text-[#6d2f0c]">
        {eyebrow}
      </p>
      <div className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-[#8a5218] bg-[#f8c14d] text-4xl shadow-inner">
          {icon}
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="break-words text-3xl font-black leading-none sm:text-4xl">
            {value}
          </h2>
          <p className="mt-1 font-black text-[#53351b]">{detail}</p>
        </div>
      </div>

      {typeof progress === "number" && (
        <div className="mt-5 h-4 overflow-hidden rounded-full border-2 border-[#5b2a0b] bg-[#6b3a12] shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-700 via-orange-500 to-yellow-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {typeof dots === "number" && (
        <div className="mt-5 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`h-4 w-4 rounded-full border border-[#8a5218] shadow ${
                dot < dots ? "bg-orange-500" : "bg-[#9b7b4b]"
              }`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-xs font-black uppercase tracking-wide text-[#5b270d]">
        {footer}
      </p>
    </article>
  );
}

function AdventureLevel({
  badge,
  label,
  state,
}: {
  badge: string;
  label: string;
  state: "done" | "current" | "locked";
}) {
  const styles = {
    done: "border-green-900 bg-gradient-to-b from-green-500 to-green-800 text-white",
    current:
      "scale-110 border-yellow-300 bg-gradient-to-b from-red-500 to-red-900 text-white shadow-[0_0_20px_rgba(250,204,21,0.8)]",
    locked: "border-slate-600 bg-gradient-to-b from-slate-400 to-slate-700 text-slate-100 opacity-80",
  };

  return (
    <div className="relative text-center">
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 text-3xl shadow-xl ${styles[state]}`}>
        {badge}
      </div>
      {state !== "locked" && (
        <div className="absolute left-1/2 top-12 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-green-600 text-xs text-white">
          ✓
        </div>
      )}
      <p className="mt-4 rounded-lg border-2 border-[#5b2a0b] bg-[#5b2a0b] px-2 py-1 text-xs font-black uppercase text-yellow-100 shadow">
        {label}
      </p>
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
