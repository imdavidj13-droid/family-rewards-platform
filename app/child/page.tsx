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
    <main
  className="min-h-screen bg-[#1b1008] bg-repeat text-white"
  style={{
    backgroundImage: "url('/images/pirate/wood-bg.png')",
    backgroundSize: "520px 520px",
  }}
>
      <div className="flex min-h-screen">
        <ChildSidebar child={child} />

        <section className="flex-1 overflow-hidden">
          <div className="w-full max-w-[1180px] space-y-4 p-3 md:p-4">
            <HeroBanner child={child} points={points} />

            <StatsRow
              points={points}
              progress={progress}
              xpToNextLevel={xpToNextLevel}
            />

            <div className="grid grid-cols-1 items-start gap-0 xl:grid-cols-[390px_1fr]">
              <TodaysQuests tasks={tasks} onComplete={completeTask} />

              <div className="w-full space-y-3">
                <AdventureMap points={points} />
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
    <section
  className="-mx-3 -mt-4 rounded-none border border-[#5a2b0b] px-3 py-5 shadow-2xl md:-mx-4"
  style={{
    backgroundImage: "url('/images/pirate/wood-bg.png')",
    backgroundSize: "360px 360px",
    boxShadow:
  "inset 0 3px 0 rgba(255,190,80,0.28), inset 0 -4px 0 rgba(170,90,24,0.6), inset 0 -14px 0 rgba(0,0,0,0.7), inset 6px 0 10px rgba(0,0,0,0.35), inset -6px 0 10px rgba(0,0,0,0.35), 0 14px 24px rgba(0,0,0,0.65)",
  }}
>
  <div className="grid items-center gap-4 md:grid-cols-3">
      
<div className="relative flex h-[255px] items-center justify-center overflow-hidden rounded-3xl shadow-xl">
  <img
    src="/images/pirate/treasure-card.png"
    alt=""
    className="absolute inset-0 h-full w-full  object-fill"
  />

  <div className="relative z-10 flex w-full items-center gap-2 px-2">
    <div className="relative -ml-6 flex h-48 w-48 shrink-0 items-center justify-center">
      <img
        src="/images/pirate/anchor-badge.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-xl"
      />
    </div>

    <div className="min-w-0 flex-1 -translate-x-6 -translate-y-1">
      <p
        className={`${cinzel.className} text-xl font-black uppercase leading-none tracking-wide text-amber-950`}
      >
        Captain Level
      </p>

      <h2 className="mt-2 text-5xl font-black leading-none text-slate-950">
        Level 7
      </h2>

      <p className="mt-1 text-2xl font-black leading-none text-slate-800">
        First Mate
      </p>

    <div className="mt-4 flex flex-col items-start">
  <div className="w-[210px]">
    <div className="h-6 overflow-hidden rounded-full border-2 border-[#3a1b06] bg-[#2b1708] shadow-inner">
      <div
        className="h-full rounded-full bg-[#c21f13] shadow-[inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-2px_2px_rgba(0,0,0,0.35)]"
        style={{ width: `${progress}%` }}
      />
    </div>

    <p className="mt-4 text-center text-base font-black text-slate-800">
      {xpToNextLevel} XP until Level 8
    </p>
  </div>
</div>
</div>
</div>
</div>
      <StatCard icon="🪙" label="Your Treasure" value={points} footer="Gold Doubloons" />
      <StatCard icon="🔥" label="Daily Streak" value={3} footer="Days in a row!" />
      </div>
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
  const isTreasureCard = label === "Your Treasure";

  return (
    <div className="relative flex h-[255px] items-center justify-center overflow-hidden rounded-3xl shadow-xl">
      <img
        src="/images/pirate/treasure-card.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.12] object-fill"
      />
{isTreasureCard ? (
  <div className="relative z-10 flex w-full items-center gap-2 px-2">
    <div className="relative -ml-6 flex h-48 w-48 shrink-0 items-center justify-center">
      <img
        src="/images/pirate/gold-coins.png"
        alt=""
        className="h-full w-full object-contain drop-shadow-xl"
      />
    </div>

    <div className="min-w-0 flex-1 -translate-x-5 -translate-y-5">
  <div className="flex h-[150px] flex-col items-start justify-start pt-0">
        <p
          className={`${cinzel.className} text-xl font-black uppercase leading-none tracking-wide text-amber-950`}
        >
          Your Treasure
        </p>

        <h2 className="mt-8 text-6xl font-black leading-none text-slate-950">
          {value}
        </h2>

        <p className="mt-3 text-2xl font-black leading-none text-slate-800">
          Gold Doubloons
        </p>
      </div>
    </div>
  </div>
) : (
      
  <div className="relative z-10 flex w-full items-center gap-2 px-2">
    <div className="relative -ml-6 flex h-48 w-48 shrink-0 items-center justify-center text-8xl drop-shadow-xl">
      <img src="/images/pirate/streak-icon.png" 
      alt="" 
      className="h-full w-full object-contain drop-shadow-xl" />
    </div>

    <div className="min-w-0 flex-1 -translate-x-5 -translate-y-5">
      <div className="flex h-[150px] flex-col items-start justify-start pt-0">
        <p
          className={`${cinzel.className} text-xl font-black uppercase leading-none tracking-wide text-amber-950`}
        >
          {label}
        </p>

        <h2 className="mt-7 text-6xl font-black leading-none text-slate-950">
          {value}
        </h2>

        <p className="mt-3 text-2xl font-black leading-none text-slate-800">
          {footer}
        </p>
      </div>
    </div>
  </div>
)}
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
  const visibleTasks = tasks.slice(0, 5);

  return (
  <section className="relative -mt-7 w-full [container-type:inline-size]">
    <div className="relative aspect-[420/685] w-full">
      <img
        src="/images/pirate/quest-panel.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill drop-shadow-2xl"
      />

      <h2
        className={`${cinzel.className} absolute left-[12%] right-[12%] top-[6%] text-center text-2xl font-black uppercase tracking-wide text-yellow-100 drop-shadow-[0_2px_1px_rgba(60,15,0,0.9)]`}
      >
        Today&apos;s Quests
      </h2>

      <div className="absolute left-[11%] right-[11%] top-[19%] space-y-2">
        {visibleTasks.length === 0 ? (
          <div className="rounded-2xl border-2 border-[#c89548] bg-[#f5d99c]/90 px-4 py-8 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_3px_6px_rgba(80,35,5,0.25)]">
            <div className="text-6xl">🏴‍☠️</div>

            <h3 className="mt-4 text-2xl font-black text-[#3a2108]">
              Quest Complete!
            </h3>

            <p className="mt-2 font-black text-[#5b3710]">
              You&apos;ve finished every quest for today.
            </p>
          </div>
        ) : (
          visibleTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl border-2 border-[#c89548] bg-[#f5d99c]/90 px-5 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_4px_7px_rgba(80,35,5,0.3)]"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center text-3xl">
                  {getQuestIcon(task.title)}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black leading-tight text-[#3a2108]">
                    {task.title}
                  </h3>

                  <p className="text-sm font-black text-[#5b3710]">
                    +{task.points} XP
                  </p>
                </div>
              </div>

              <button
                onClick={() => onComplete(task.id, task.points)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#2d5f12] bg-green-600 text-2xl font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_3px_4px_rgba(60,30,5,0.35)] hover:bg-green-700"
              >
                ✓
              </button>
            </div>
          ))
        )}
      </div>

      <button
        className={`${cinzel.className} absolute bottom-[10%] left-[16%] right-[16%] text-center text-2xl font-black uppercase tracking-wide text-yellow-100 drop-shadow-[0_2px_1px_rgba(60,15,0,0.9)]`}
      >
        View All Quests
      </button>
      </div>
    </section>
  );
}

function AdventureMap({ points }: { points: number }) {
  const mapLevels = [
    {
      level: 5,
      name: "Level 5",
      left: 18,
      top: 48,
      icon: "/images/pirate/level-icon-blue.png",
      banner: "/images/pirate/level-banner-blue.png",
      iconSize: "16cqw",
      bannerSize: "12cqw",
      bannerTop: "-7cqw",
      textLift: "0px",
    },
    {
      level: 6,
      name: "Level 6",
      left: 38,
      top: 64,
      icon: "/images/pirate/level-icon-red.png",
      banner: "/images/pirate/level-banner-blue.png",
      iconSize: "16cqw",
      bannerSize: "12cqw",
      bannerTop: "-7cqw",
      textLift: "0px",
    },
    {
      level: 7,
      name: "Level 7",
      left: 60,
      top: 38,
      icon: "/images/pirate/level-next.png",
      banner: "/images/pirate/level-banner-red.png",
      iconSize: "15cqw",
      bannerSize: "12.5cqw",
      bannerTop: "-10cqw",
      textLift: "-0.4cqw",
    },
    {
      level: 8,
      name: "Level 8",
      left: 78,
      top: 62,
      icon: "/images/pirate/level-icon-locked.png",
      banner: "/images/pirate/level-banner-brown.png",
      iconSize: "11cqw",
      bannerSize: "12cqw",
      bannerTop: "-5.5cqw",
      textLift: "0px",
    },
  ];

  return (
    <section className="relative">
      <div className="relative w-full max-w-[640px]">
        <div className="relative aspect-[16/10] w-full">
          <img
            src="/images/pirate/adventure-frame.png"
            alt=""
            className="absolute inset-0 z-10 h-full w-full object-fill"
          />
          <div className="absolute left-1/2 top-[-11.5%] z-50 flex h-[36%] w-[65%] -translate-x-1/2 items-center">
  <img
    src="/images/pirate/map-top-banner.png"
    alt=""
    className="h-full w-full object-fill"
  />

  <p
    className={`${cinzel.className} absolute inset-0 flex items-center justify-center font-black uppercase text-yellow-100`}
    style={{
      fontSize: "clamp(12px, 1.5cqw, 24px)",
      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
    }}
  >
    YOUR ADVENTURE
  </p>
</div>

<div className="absolute bottom-[-10.1%] left-1/2 z-50 flex h-[30%] w-[65%] -translate-x-1/2 items-center">
  <img
    src="/images/pirate/map-bottom-banner.png"
    alt=""
    className="h-full w-full object-fill"
  />

  <p
    className={`${cinzel.className} absolute inset-0 flex items-center justify-center font-black text-[#4a2408]`}
    style={{
      fontSize: "clamp(10px, 1.3cqw, 20px)",
    }}
  >
    You're on a roll, Captain! 🏴‍☠️
  </p>
</div>

         <div className="absolute left-[6%] top-[7%] z-20 h-[86%] w-[88%] overflow-hidden [container-type:inline-size]">
  <img
    src="/images/pirate/adventure-ocean.png"
    alt=""
    className="absolute inset-0 h-full w-full object-fill"
  />
            

            <svg
              className="absolute inset-0 z-20 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 16 48 C 24 54, 30 66, 38 64 S 52 42, 60 42 S 74 64, 82 62"
                fill="none"
                stroke="#f5d28a"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                strokeLinecap="round"
              />
            </svg>

            {mapLevels.map((item) => (
              <div
                key={item.level}
                className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${item.left}%`, top: `${item.top}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    className="relative z-10 object-contain drop-shadow-xl"
                    style={{ width: item.iconSize }}
                  />
                </div>

                <div
                  className="relative"
                  style={{
                    marginTop: item.bannerTop,
                    width: item.bannerSize,
                  }}
                >
                  <img
                    src={item.banner}
                    alt=""
                    className="w-full object-contain"
                  />

                  <p
                    className="absolute inset-0 flex items-center justify-center font-black uppercase text-yellow-100"
                    style={{
                      fontSize: "clamp(6px, 0.8cqw, 9px)",
                      transform: `translateY(${item.textLift})`,
                    }}
                  >
                    {item.name}
                  </p>
                </div>
              </div>
            ))}

            <img
              src="/images/pirate/map-boat.png"
              alt=""
              className="absolute left-[50%] top-[56%] z-40 w-[40%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-xl"
            />

        

            <div className="pointer-events-none absolute inset-0 z-50 bg-[#d8c18d]/10 mix-blend-multiply" />
            <div className="pointer-events-none absolute inset-0 z-50 shadow-[inset_0_0_40px_rgba(70,40,15,0.25)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MapLine({ done }: { done?: boolean }) {
  return (
    <div
      className={`mx-1 h-1 flex-1 border-t-4 border-dotted ${
        done ? "border-yellow-500" : "border-slate-300"
      }`}
    />
  );
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
    <section className="relative w-full overflow-hidden [container-type:inline-size]">
      <img
        src="/images/pirate/reward-shop-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
      />

      <div className="relative z-10 px-[cqw] pb-[2.2cqw] pt-[3.8cqw]">
        <div className="absolute left-[15cqw] top-[1.5cqw] z-20">
          <h2
            className={`${cinzel.className} text-[clamp(14px,1.9cqw,30px)] font-black uppercase text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]`}
          >
            Reward Shop
          </h2>
        </div>

        <button className="absolute right-[5.2cqw] top-[1.9cqw] z-20 text-[clamp(9px,1.05cqw,15px)] font-black uppercase text-yellow-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
  View All
</button>

        <div className="grid grid-cols-4 gap-[0.8cqw]">
          {rewards.slice(0, 4).map((reward) => {
            const isPending = pendingRewards.some(
              (request) => request.reward_id === reward.id
            );

            return (
              <div
                key={reward.id}
                className="relative h-[27cqw]"
              >
                <img
                  src="/images/pirate/reward-card.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-fill"
                />

                <img
                  src={reward.image_url}
                  alt={reward.title}
                  className="absolute left-1/2 top-[2%] h-[18cqw] w-[18cqw] -translate-x-1/2 object-contain drop-shadow-xl"
                />

                <h3 className="absolute bottom-[7.6cqw] left-1/2 w-full -translate-x-1/2 px-[0.5cqw] text-center text-[clamp(16px,1.25cqw,18px)] font-black leading-tight text-[#2b1608]">
                  {reward.title}
                </h3>

                <button
                  onClick={() => onRedeem(reward.id)}
                  disabled={isPending}
                  className="absolute bottom-[0.8cqw] left-1/2 h-[8cqw] w-[15cqw] -translate-x-1/2"
                >
                  <img
                    src="/images/pirate/redeem-button.png"
                    alt=""
                    className="h-full w-full object-fill"
                  />

                  <span className="absolute inset-0 flex items-center justify-center gap-[0.35cqw]">
                    <img
                      src="/images/pirate/doubloon.png"
                      alt=""
                      className="h-[3.5cqw] w-[3.5cqw] object-contain"
                    />

                    <span
                      className={`${cinzel.className} text-[clamp(15px,1.1cqw,16px)] font-black text-yellow-100`}
                    >
                      {reward.cost}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
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