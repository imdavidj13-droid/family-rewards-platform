"use client";

import { useEffect, useState } from "react";
import ChildSidebar from "@/components/ChildSidebar";
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
        child_id,
          reward_id,
        rewards (
          title,
          cost
        )
      `)
      .eq("child_id", childData.id)
  .eq("status", "pending")
      .order("created_at", { ascending: false })
     

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
        <ChildSidebar child={child} />

        <section className="flex-1 p-6 md:p-8">
       {/* Adventure Hero */}
<section
  className="relative -mx-8 -mt-8 mb-0 min-h-[260px] overflow-hidden shadow-2xl"
  style={{
    backgroundImage: "url('/images/pirate/hero-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute inset-0 bg-black/35" />
  <div className="relative z-10 grid min-h-[260px] gap-6 p-8 md:grid-cols-[1fr_260px]">
    <div className="p-8 text-white">
      <div className="flex items-center gap-6">
  <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-yellow-600 bg-gradient-to-br from-sky-700 to-slate-950 text-7xl shadow-xl">
    🧒
  </div>

  <div>
    <p className="text-xl font-black text-amber-900">
      Ahoy there,
    </p>

    <h1 className="mt-1 text-6xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
      {child?.name || "Explorer"}!
    </h1>

    <p className="mt-4 max-w-xl text-xl font-bold text-white drop-shadow-xl">
      You&apos;re doing great, Captain! Keep up the good work! 🏴‍☠️
    </p>
  </div>
</div>
    </div>

   <div className="hidden md:flex items-center justify-end -mr-8">
  <div
  className="relative h-[380px] w-[380px] bg-contain bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/pirate/treasure-sign.png')",
    }}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 text-center">
      <p className="text-sm font-black uppercase text-yellow-100">
        YOUR TREASURE
      </p>

      <h2 className="mt-2 text-6xl font-black text-yellow-300">
        {child?.points || 0}
      </h2>

      <p className="mt-2 text-sm font-black uppercase text-yellow-100">
        🪙 GOLD DOUBLOONS
      </p>
    </div>
  </div>
</div>
  </div>
</section>

{/* Adventure Stats */}
<section className="mb-6 grid gap-5 md:grid-cols-3">
  <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-5 text-slate-950 shadow-xl">
    <p className="text-center text-xs font-black uppercase tracking-wide text-amber-900">
      Captain Level
    </p>

    <div className="mt-3 flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-red-900 bg-red-700 text-5xl shadow">
        ⚓
      </div>

      <div>
        <h2 className="text-4xl font-black">Level 7</h2>
        <p className="font-black text-slate-700">First Mate</p>
      </div>
    </div>

    <div className="mt-5 h-3 overflow-hidden rounded-full bg-yellow-300">
      <div
        className="h-full rounded-full bg-red-600"
        style={{
          width: `${Math.min(((child?.points || 0) / 100) * 100, 100)}%`,
        }}
      />
    </div>

    <p className="mt-2 text-center text-xs font-black text-slate-700">
      {100 - ((child?.points || 0) % 100)} XP until Level 8
    </p>
  </div>

  <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-5 text-center text-slate-950 shadow-xl">
    <p className="text-xs font-black uppercase tracking-wide text-amber-900">
      Your Treasure
    </p>

    <div className="mt-4 text-6xl">🪙</div>

    <h2 className="mt-3 text-5xl font-black">
      {child?.points || 0}
    </h2>

    <p className="font-black text-slate-700">Gold Doubloons</p>
  </div>

  <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-5 text-center text-slate-950 shadow-xl">
    <p className="text-xs font-black uppercase tracking-wide text-amber-900">
      Daily Streak
    </p>

    <div className="mt-4 text-6xl">🔥</div>

    <h2 className="mt-3 text-5xl font-black">3</h2>

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


          <div className="-mt-6 grid items-stretch gap-6 lg:grid-cols-[450px_1fr]">
            <div
  className={`h-full rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
>
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-700 text-2xl text-white">
              {getQuestIcon(task.title)}
            </div>

            <div>
              <h3 className="font-black text-slate-950">
                {task.title}
              </h3>

              <p className="text-sm font-black text-amber-900">
                ⭐ +{task.points} XP
              </p>
            </div>
          </div>

          <button
            onClick={() => completeTask(task.id, task.points)}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white hover:bg-green-700"
          >
            Complete
          </button>
        </div>
      </div>
    ))}
  </div>
)}
            </div>


            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <div className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-6 shadow-xl">
  <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
    🗺️ Your Adventure
  </h2>

  <div className="rounded-2xl border-2 border-yellow-700 bg-sky-200 p-8">
    <div className="text-center text-7xl">
      ⛵
    </div>

    <div className="mt-8 flex items-center justify-between">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
          ⚓
        </div>
        <p className="mt-2 text-sm font-black">
          Level 5
        </p>
      </div>

      <div className="h-1 flex-1 bg-yellow-600" />

      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
          ⚓
        </div>
        <p className="mt-2 text-sm font-black">
          Level 6
        </p>
      </div>

      <div className="h-1 flex-1 bg-yellow-600" />

      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-yellow-400 bg-red-600 text-white">
          ⭐
        </div>
        <p className="mt-2 text-sm font-black">
          Level 7
        </p>
      </div>

      <div className="h-1 flex-1 bg-gray-400" />

      <div className="text-center opacity-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 text-white">
          🔒
        </div>
        <p className="mt-2 text-sm font-black">
          Level 8
        </p>
      </div>
    </div>

    <div className="mt-6 rounded-xl bg-yellow-200 p-3 text-center font-black text-amber-900">
      You're on a roll, Captain! 🏴‍☠️
    </div>
  </div>
</div>
<div className="mt-6 rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-6 shadow-xl">
  <h2 className="mb-4 text-center text-2xl font-black text-amber-900">
    🎁 Reward Shop
  </h2>

  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {rewards.slice(0, 4).map((reward) => {
    const isPending = pendingRewards.some(
      (request) => request.reward_id === reward.id
    );

    return (
      <div
        key={reward.id}
        className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-5 text-center shadow"
      >
        <div className="text-8xl">
  {getRewardIcon(reward.title)}
</div>

        <h3 className="mt-4 text-xl font-black text-slate-950">
          {reward.title}
        </h3>

        <p className="mt-2 text-sm font-black text-amber-900">
          🪙 {reward.cost} Doubloons
        </p>

        <button
          onClick={() => redeemReward(reward.id)}
          disabled={isPending}
          className={`mt-4 rounded-xl px-5 py-3 text-sm font-black text-white ${
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