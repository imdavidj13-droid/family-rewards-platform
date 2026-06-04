"use client";

import { useEffect, useState } from "react";
import ChildSidebar from "@/components/ChildSidebar";
import Toast from "@/components/Toast";
import { useRealtime } from "@/hooks/useRealtime";
import { supabase } from "@/lib/supabase";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export default function ChildPage() {
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
  useRealtime("tasks", loadChildPortal);

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
      setToast({ type: "error", message: childError.message });
      return;
    }

    setChild(childData);

    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("completed", false);

    setTasks(taskData || []);

    const { data: rewardData } = await supabase
      .from("rewards")
      .select("*");

    setRewards(rewardData || []);

    const { data: pendingData } = await supabase
      .from("redemptions")
      .select(`
        id,
        status,
        created_at,
        child_id,
        reward_id,
        rewards (
          title,
          cost
        )
      `)
      .eq("child_id", childData.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

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
      .update({ points: child.points + points })
      .eq("id", child.id);

    if (childError) {
      setToast({ type: "error", message: childError.message });
      return;
    }

    setToast({
      type: "success",
      message: `Quest complete! +${points} doubloons`,
    });

    loadChildPortal();
  }

  async function redeemReward(rewardId: string) {
    if (!child) {
      setToast({ type: "error", message: "No child found." });
      return;
    }

    const alreadyPending = pendingRewards.some(
      (request) => request.reward_id === rewardId
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
  const progress = Math.min(points % 100, 100);
  const xpToNextLevel = 100 - progress;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-950 via-blue-950 to-slate-950 text-white">
      <div className="flex min-h-screen">
        <ChildSidebar child={child} />

        <section className="flex-1 overflow-hidden">
          <div className="w-full space-y-4 p-3 md:p-4">
            <HeroBanner child={child} points={points} />

            <StatsRow
              points={points}
              progress={progress}
              xpToNextLevel={xpToNextLevel}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TodaysQuests tasks={tasks} onComplete={completeTask} />

              <div className="space-y-4">
                <AdventureMap />
                <RewardShopPreview
                  rewards={rewards}
                  pendingRewards={pendingRewards}
                  onRedeem={redeemReward}
                />
              </div>
            </div>

            <RecentAchievements />
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

function HeroBanner({ child, points }: { child: any; points: number }) {
  return (
    <section
      className="relative -mx-3 -mt-3 overflow-hidden bg-cover bg-center shadow-2xl"
      style={{
        backgroundImage: "url('/images/pirate/hero-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-[260px] items-center justify-center px-3 py-4 md:min-h-[320px] md:px-6">
        <div className="relative w-[96vw] max-w-[800px] [container-type:inline-size]">
          <img
            src="/images/pirate/hero-scroll.png"
            alt=""
            className="h-auto w-full object-contain"
          />

          <div className="absolute inset-0 flex items-center">
            <div className="ml-[4%] flex w-[82%] items-center gap-[0%]">
              <img
                src="/images/pirate/pirate-avatar.png"
                alt="Pirate Avatar"
                className="w-[45%] shrink-0 object-contain drop-shadow-2xl"
              />

              <div className="min-w-0 flex-1 leading-none">
  <p
    className={`${cinzel.className} text-[4cqw] font-black uppercase leading-none text-amber-900`}
  >
    Ahoy there,
  </p>

  <h1
    className={`${cinzel.className} text-[11cqw] font-black uppercase leading-none tracking-wide text-slate-950`}
  >
    {child?.name || "Explorer"}!
  </h1>

  <p className="mt-1 max-w-[22ch] text-[3.6cqw] font-black leading-tight text-slate-800">
    Keep up the good work, Captain!
  </p>
</div>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-end translate-x-12 md:flex">
          <div
            className="relative h-[230px] w-[230px] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/pirate/treasure-sign.png')",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 text-center">
              <p className="text-xs font-black uppercase text-yellow-100">
                Your Treasure
              </p>

              <h2 className="mt-1 text-5xl font-black text-yellow-300">
                {points}
              </h2>

              <p className="mt-1 text-xs font-black uppercase text-yellow-100">
                🪙 Doubloons
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsRow({
  points,
  progress,
  xpToNextLevel,
}: {
  points: number;
  progress: number;
  xpToNextLevel: number;
}) {
  return (
    <section className="-mt-4 grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
        <p className="text-center text-xs font-black uppercase text-amber-900">
          Captain Level
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-red-900 bg-red-700 text-4xl shadow">
            ⚓
          </div>

          <div>
            <h2 className="text-3xl font-black">Level 7</h2>
            <p className="font-black text-slate-700">First Mate</p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-yellow-300">
          <div
            className="h-full rounded-full bg-red-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-center text-xs font-black text-slate-700">
          {xpToNextLevel} XP until Level 8
        </p>
      </div>

      <StatCard icon="🪙" label="Your Treasure" value={points} footer="Gold Doubloons" />
      <StatCard icon="🔥" label="Daily Streak" value={3} footer="Days in a row!" />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  footer,
}: {
  icon: string;
  label: string;
  value: number;
  footer: string;
}) {
  return (
    <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-center text-slate-950 shadow-xl">
      <p className="text-xs font-black uppercase text-amber-900">{label}</p>
      <div className="mt-3 text-5xl">{icon}</div>
      <h2 className="mt-2 text-4xl font-black">{value}</h2>
      <p className="font-black text-slate-700">{footer}</p>
    </div>
  );
}

function TodaysQuests({
  tasks,
  onComplete,
}: {
  tasks: any[];
  onComplete: (id: string, points: number) => void;
}) {
  return (
    <section className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
      <h2 className="mb-4 text-2xl font-black text-amber-900">
        📜 Quest Board
      </h2>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border-2 border-yellow-800 bg-yellow-50 p-6 text-center">
          <div className="text-6xl">🏴‍☠️</div>

          <h3 className="mt-4 text-2xl font-black text-amber-900">
            Quest Complete!
          </h3>

          <p className="mt-2 font-medium text-slate-700">
            You&apos;ve finished every quest for today.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4 shadow"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-700 text-2xl text-white">
                    {getQuestIcon(task.title)}
                  </div>

                  <div>
                    <h3 className="font-black text-slate-950">{task.title}</h3>
                    <p className="text-sm font-black text-amber-900">
                      ⭐ +{task.points} XP
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onComplete(task.id, task.points)}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white hover:bg-green-700"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AdventureMap() {
  return (
    <section className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
      <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
        🗺️ Your Adventure
      </h2>

      <div className="rounded-2xl border-2 border-yellow-700 bg-sky-200 p-5">
        <div className="text-center text-6xl">⛵</div>

        <div className="mt-6 flex items-center justify-between">
          <MapStep label="Level 5" icon="⚓" done />
          <MapLine done />
          <MapStep label="Level 6" icon="⚓" done />
          <MapLine done />
          <MapStep label="Level 7" icon="⭐" active />
          <MapLine />
          <MapStep label="Level 8" icon="🔒" locked />
        </div>

        <div className="mt-5 rounded-xl bg-yellow-200 p-3 text-center font-black text-amber-900">
          You&apos;re on a roll, Captain! 🏴‍☠️
        </div>
      </div>
    </section>
  );
}

function MapStep({
  label,
  icon,
  done,
  active,
  locked,
}: {
  label: string;
  icon: string;
  done?: boolean;
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <div className={`text-center ${locked ? "opacity-50" : ""}`}>
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-white ${
          active
            ? "border-4 border-yellow-400 bg-red-600"
            : done
              ? "bg-green-600"
              : "bg-gray-500"
        }`}
      >
        {icon}
      </div>
      <p className="mt-2 text-xs font-black">{label}</p>
    </div>
  );
}

function MapLine({ done }: { done?: boolean }) {
  return <div className={`h-1 flex-1 ${done ? "bg-yellow-600" : "bg-gray-400"}`} />;
}

function RewardShopPreview({
  rewards,
  pendingRewards,
  onRedeem,
}: {
  rewards: any[];
  pendingRewards: any[];
  onRedeem: (id: string) => Promise<void>;
}) {
  return (
    <section className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
      <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
        🎁 Reward Shop
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {rewards.slice(0, 4).map((reward) => {
          const isPending = pendingRewards.some(
            (request) => request.reward_id === reward.id
          );

          return (
            <div
              key={reward.id}
              className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4 text-center shadow"
            >
              <div className="text-5xl">{getRewardIcon(reward.title)}</div>

              <h3 className="mt-3 text-lg font-black text-slate-950">
                {reward.title}
              </h3>

              <p className="mt-1 text-sm font-black text-amber-900">
                🪙 {reward.cost} Doubloons
              </p>

              <button
                onClick={() => onRedeem(reward.id)}
                disabled={isPending}
                className={`mt-3 rounded-xl px-4 py-2 text-sm font-black text-white ${
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
    </section>
  );
}

function RecentAchievements() {
  return (
    <section className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
      <h2 className="mb-3 text-2xl font-black text-amber-900">
        🏆 Recent Achievements
      </h2>

      <div className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4">
        <p className="font-black text-slate-800">
          Complete quests to unlock achievements.
        </p>
      </div>
    </section>
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