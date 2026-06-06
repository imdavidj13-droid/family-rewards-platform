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

// ─────────────────────────────────────────────
// LAYOUT + THEME CONFIG
// All sizing, spacing, and asset references live
// here so future theme changes are one-place edits.
// ─────────────────────────────────────────────
const layout = {
  // Page shell
  pageBg: "#1b1008",
  pageBgImage: "url('/themes/pirate/background-main/wood-bg.png')",

  pageBgSize: "520px 520px",

  // Dashboard content column
  dashboardMaxWidth: "1180px",
  dashboardPadding: "p-3 md:p-5",

  // Hero section
  heroBgImage: "url('/themes/pirate/hero-main/hero-bg.jpg')",
  heroMinHeightMobile: "200px",
  heroMinHeightDesktop: "320px",

  // Stats row
  statsRowBorder: "#5a2b0b",
  statsRowBgImage: "url('/themes/pirate/background-main/wood-bg.png')",
  statsRowBgSize: "360px 360px",
  statsRowBoxShadow:
    "inset 0 3px 0 rgba(255,190,80,0.28), inset 0 -4px 0 rgba(170,90,24,0.6), inset 0 -14px 0 rgba(0,0,0,0.7), inset 6px 0 10px rgba(0,0,0,0.35), inset -6px 0 10px rgba(0,0,0,0.35), 0 14px 24px rgba(0,0,0,0.65)",

  // Two-column split
  questPanelWidth: "xl:w-[390px]",   // fixed-width left column at xl+
  rightColMinWidth: "xl:min-w-0",    // right column fills remaining space

  // Quest card colours
  questCardBorder: "#c89548",
  questCardBg: "rgba(245,217,156,0.92)",

  // XP bar
  xpBarBg: "#2b1708",
  xpBarBorder: "#3a1b06",
  xpBarFill: "#c21f13",

  // Reward shop
  rewardCardTextColor: "#2b1608",
} as const;

const assets = {
  woodBg: "/themes/pirate/background-main/wood-bg.png",

  heroBg: "/themes/pirate/hero-main/hero-bg.jpg",
  heroScroll: "/themes/pirate/hero-main/hero-scroll.png",
  pirateAvatar: "/themes/pirate/avatars/pirate-avatar.png",
  treasureSign: "/themes/pirate/hero-main/treasure-sign.png",

  treasureCard: "/themes/pirate/stat-cards/treasure-card.png",
  anchorBadge: "/themes/pirate/stat-cards/anchor-badge.png",
  goldCoins: "/themes/pirate/stat-cards/gold-coins.png",
  streakIcon: "/themes/pirate/stat-cards/streak-icon.png",

  questPanel: "/themes/pirate/quests/quest-panel.png",

  adventureFrame: "/themes/pirate/adventure-card/adventure-frame.png",
  mapTopBanner: "/themes/pirate/adventure-card/map-top-banner.png",
  mapBottomBanner: "/themes/pirate/adventure-card/map-bottom-banner.png",
  adventureOcean: "/themes/pirate/adventure-card/adventure-ocean.png",
  mapBoat: "/themes/pirate/adventure-card/map-boat.png",

  rewardShopBg: "/themes/pirate/rewards-shop/reward-shop-bg.png",
  rewardCard: "/themes/pirate/rewards-shop/reward-card.png",
  redeemButton: "/themes/pirate/rewards-shop/redeem-button.png",
  doubloon: "/themes/pirate/rewards-shop/doubloon.png",

  levelIconBlue: "/themes/pirate/adventure-card/level-icon-blue.png",
  levelIconRed: "/themes/pirate/adventure-card/level-icon-red.png",
  levelNext: "/themes/pirate/adventure-card/level-next.png",
  levelIconLocked: "/themes/pirate/adventure-card/level-icon-locked.png",

  levelBannerBlue: "/themes/pirate/adventure-card/level-banner-blue.png",
  levelBannerRed: "/themes/pirate/adventure-card/level-banner-red.png",
  levelBannerBrown: "/themes/pirate/adventure-card/level-banner-brown.png",
} as const;

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
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

  // ── Data loading ──────────────────────────
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
      setToast({ type: "error", message: "No child profile is linked to this account." });
      return;
    }

    const { data: childData, error: childError } = await supabase
      .from("children")
      .select("*")
      .eq("id", profile.child_id)
      .single();

    if (childError) { setToast({ type: "error", message: childError.message }); return; }
    setChild(childData);

    const { data: taskData } = await supabase.from("tasks").select("*").eq("completed", false);
    setTasks(taskData || []);

    const { data: rewardData } = await supabase.from("rewards").select("*");
    setRewards(rewardData || []);

    const { data: pendingData } = await supabase
      .from("redemptions")
      .select(`id, status, created_at, child_id, reward_id, rewards (title, cost)`)
      .eq("child_id", childData.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setPendingRewards(pendingData || []);
  }

  // ── Actions ───────────────────────────────
  async function completeTask(taskId: string, points: number) {
    if (!child) { setToast({ type: "error", message: "No child found." }); return; }

    const { error: taskError } = await supabase.from("tasks").update({ completed: true }).eq("id", taskId);
    if (taskError) { setToast({ type: "error", message: taskError.message }); return; }

    const { error: childError } = await supabase
      .from("children")
      .update({ points: child.points + points })
      .eq("id", child.id);
    if (childError) { setToast({ type: "error", message: childError.message }); return; }

    setToast({ type: "success", message: `Quest complete! +${points} doubloons` });
    loadChildPortal();
  }

  async function redeemReward(rewardId: string) {
    if (!child) { setToast({ type: "error", message: "No child found." }); return; }

    const alreadyPending = pendingRewards.some((r) => r.reward_id === rewardId);
    if (alreadyPending) { setToast({ type: "info", message: "You've already requested this reward." }); return; }

    const { error } = await supabase.from("redemptions").insert({
      child_id: child.id,
      reward_id: rewardId,
      status: "pending",
    });
    if (error) { setToast({ type: "error", message: error.message }); return; }

    setToast({ type: "success", message: "Reward requested successfully!" });
    loadChildPortal();
  }

  // ── Derived values ────────────────────────
  const points       = child?.points ?? 0;
  const progress     = Math.min(points % 100, 100);
  const xpToNextLevel = 100 - progress;

  // ── Render ────────────────────────────────
  return (
    <main
      className="min-h-screen bg-repeat text-white"
      style={{
        backgroundColor: layout.pageBg,
        backgroundImage: layout.pageBgImage,
        backgroundSize: layout.pageBgSize,
      }}
    >
      {/* ── Outer shell: sidebar + scrollable content ── */}
      <div className="flex min-h-screen">
        <ChildSidebar child={child} />

        {/* ── Main scrollable area ── */}
        <div className="flex flex-1 flex-col overflow-x-hidden">
          {/* ── Centred dashboard column ── */}
          <div
  className={`mx-auto w-full flex-1 space-y-4 ${layout.dashboardPadding}`}
  style={{ maxWidth: layout.dashboardMaxWidth }}
>

            {/* 1. Hero */}
            <HeroBanner child={child} points={points} />

            {/* 2. Stats row */}
            <StatsRow points={points} progress={progress} xpToNextLevel={xpToNextLevel} />

            {/* 3. Two-column layout: quests | map+shop */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              {/* Left – quest panel (fixed width on xl) */}
              <div className={`w-full ${layout.questPanelWidth} xl:shrink-0`}>
                <TodaysQuests tasks={tasks} onComplete={completeTask} />
              </div>

              {/* Right – adventure map stacked above reward shop */}
              <div className={`flex w-full flex-col gap-4 ${layout.rightColMinWidth}`}>
                <AdventureMap points={points} />
                <RewardShopPreview
                  rewards={rewards}
                  pendingRewards={pendingRewards}
                  onRedeem={redeemReward}
                />
              </div>
            </div>

            {/* 4. Achievements */}
            <RecentAchievements />
          </div>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────
// HERO BANNER
// Uses a background image overlay pattern.
// Mobile: stacks vertically, hides treasure sign.
// Desktop: side-by-side with treasure sign.
// ─────────────────────────────────────────────
function HeroBanner({ child, points }: { child: any; points: number }) {
  return (
    <section
      className="relative -mx-3 -mt-3 overflow-hidden bg-cover bg-center shadow-2xl md:-mx-5 md:-mt-5"
      style={{ backgroundImage: layout.heroBgImage }}
    >
      {/* Darkening overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content row */}
      <div
        className="relative z-10 flex items-center justify-center gap-4 px-3 py-4 md:px-6"
        style={{
          minHeight: `clamp(${layout.heroMinHeightMobile}, 28vw, ${layout.heroMinHeightDesktop})`,
        }}
      >
        {/* Scroll + avatar + greeting */}
        <div className="relative w-full max-w-[min(800px,96vw)] [container-type:inline-size]">
          <img
            src={assets.heroScroll}
            alt=""
            className="h-auto w-full object-contain"
          />

          {/* Overlay positioned content inside the scroll */}
          <div className="absolute inset-0 flex items-center">
            <div className="ml-[4%] flex w-[82%] items-center">
              <img
                src={assets.pirateAvatar}
                alt="Pirate Avatar"
                className="w-[45%] shrink-0 object-contain drop-shadow-2xl"
              />

              <div className="min-w-0 flex-1 leading-none">
                <p className={`${cinzel.className} text-[4cqw] font-black uppercase leading-none text-amber-900`}>
                  Ahoy there,
                </p>
                <h1 className={`${cinzel.className} text-[11cqw] font-black uppercase leading-none tracking-wide text-slate-950`}>
                  {child?.name || "Explorer"}!
                </h1>
                <p className="mt-1 max-w-[22ch] text-[3.6cqw] font-black leading-tight text-slate-800">
                  Keep up the good work, Captain!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Treasure sign (hidden on mobile) */}
        <div className="hidden shrink-0 translate-x-4 items-center justify-end md:flex">
          <div
            className="relative h-[200px] w-[200px] bg-contain bg-center bg-no-repeat lg:h-[230px] lg:w-[230px]"
            style={{ backgroundImage: `url('${assets.treasureSign}')` }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 text-center">
              <p className="text-xs font-black uppercase text-yellow-100">Your Treasure</p>
              <h2 className="mt-1 text-4xl font-black text-yellow-300 lg:text-5xl">{points}</h2>
              <p className="mt-1 text-xs font-black uppercase text-yellow-100">🪙 Doubloons</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STATS ROW
// 3 equal columns on md+, stacked single column on mobile.
// Each StatCard is a fixed-height illustrated card.
// ─────────────────────────────────────────────
function StatsRow({ points, progress, xpToNextLevel }: {
  points: number; progress: number; xpToNextLevel: number;
}) {
  return (
    <section
      className="-mx-3 rounded-none border border-[#5a2b0b] px-3 py-5 shadow-2xl md:-mx-5 md:px-5"
      style={{
        backgroundImage: layout.statsRowBgImage,
        backgroundSize: layout.statsRowBgSize,
        boxShadow: layout.statsRowBoxShadow,
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Captain Level card (custom layout) */}
        <LevelCard progress={progress} xpToNextLevel={xpToNextLevel} />

        {/* Treasure card */}
        <StatCard icon={assets.goldCoins} label="Your Treasure" value={points} footer="Gold Doubloons" />

        {/* Streak card */}
        <StatCard icon={assets.streakIcon} label="Daily Streak" value={3} footer="Days in a row!" />
      </div>
    </section>
  );
}

/** The "Captain Level" card with XP progress bar */
function LevelCard({ progress, xpToNextLevel }: { progress: number; xpToNextLevel: number }) {
  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl shadow-xl sm:h-64">
      <img src={assets.treasureCard} alt="" className="absolute inset-0 h-full w-full object-fill" />

      <div className="relative z-10 flex w-full items-center gap-2 px-2">
        {/* Badge image */}
        <div className="relative -ml-4 flex h-40 w-40 shrink-0 items-center justify-center sm:h-48 sm:w-48">
          <img src={assets.anchorBadge} alt="" className="h-full w-full object-contain drop-shadow-xl" />
        </div>

        {/* Text block */}
        <div className="min-w-0 flex-1 -translate-y-1">
          <p className={`${cinzel.className} text-lg font-black uppercase leading-none tracking-wide text-amber-950`}>
            Captain Level
          </p>
          <h2 className="mt-2 text-4xl font-black leading-none text-slate-950 sm:text-5xl">Level 7</h2>
          <p className="mt-1 text-xl font-black leading-none text-slate-800 sm:text-2xl">First Mate</p>

          {/* XP bar */}
          <div className="mt-4 w-full max-w-[200px]">
            <div
              className="h-5 overflow-hidden rounded-full border-2 shadow-inner"
              style={{ borderColor: layout.xpBarBorder, backgroundColor: layout.xpBarBg }}
            >
              <div
                className="h-full rounded-full shadow-[inset_0_2px_1px_rgba(255,255,255,0.45),inset_0_-2px_2px_rgba(0,0,0,0.35)]"
                style={{ width: `${progress}%`, backgroundColor: layout.xpBarFill }}
              />
            </div>
            <p className="mt-2 text-center text-sm font-black text-slate-800">
              {xpToNextLevel} XP until Level 8
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic illustrated stat card */
function StatCard({ icon, label, value, footer }: {
  icon: string; label: string; value: number; footer: string;
}) {
  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl shadow-xl sm:h-64">
      <img src={assets.treasureCard} alt="" className="absolute inset-0 h-full w-full object-fill" />

      <div className="relative z-10 flex w-full items-center gap-2 px-2">
        {/* Icon image */}
        <div className="relative -ml-4 flex h-40 w-40 shrink-0 items-center justify-center sm:h-48 sm:w-48">
          <img src={icon} alt="" className="h-full w-full object-contain drop-shadow-xl" />
        </div>

        {/* Text block */}
        <div className="min-w-0 flex-1 -translate-y-4">
          <p className={`${cinzel.className} text-lg font-black uppercase leading-none tracking-wide text-amber-950`}>
            {label}
          </p>
          <h2 className="mt-6 text-5xl font-black leading-none text-slate-950 sm:text-6xl">{value}</h2>
          <p className="mt-3 text-xl font-black leading-none text-slate-800 sm:text-2xl">{footer}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TODAY'S QUESTS
// Aspect-ratio scroll panel that scales with its
// container. Uses cqw relative to its own width.
// ─────────────────────────────────────────────
function TodaysQuests({ tasks, onComplete }: {
  tasks: any[];
  onComplete: (id: string, points: number) => void;
}) {
  const visibleTasks = tasks.slice(0, 5);

  return (
    /* container-type so cqw resolves to this element's width */
    <section className="relative w-full [container-type:inline-size]">
      {/* Aspect-ratio box that keeps the scroll panel proportional */}
      <div className="relative aspect-[420/685] w-full">
        {/* Background scroll image */}
        <img
          src={assets.questPanel}
          alt=""
          className="absolute inset-0 h-full w-full object-fill drop-shadow-2xl"
        />

        {/* Title */}
        <h2
          className={`${cinzel.className} absolute left-[12%] right-[12%] top-[6%] text-center font-black uppercase tracking-wide text-yellow-100 drop-shadow-[0_2px_1px_rgba(60,15,0,0.9)]`}
          style={{ fontSize: "clamp(14px, 4.5cqw, 26px)" }}
        >
          Today&apos;s Quests
        </h2>

        {/* Quest list */}
        <div className="absolute left-[11%] right-[11%] top-[19%] space-y-[1.5cqw]">
          {visibleTasks.length === 0 ? (
            <div
              className="rounded-2xl border-2 px-4 py-6 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_3px_6px_rgba(80,35,5,0.25)]"
              style={{ borderColor: layout.questCardBorder, backgroundColor: layout.questCardBg }}
            >
              <div className="text-5xl">🏴‍☠️</div>
              <h3 className="mt-3 text-xl font-black text-[#3a2108]">Quest Complete!</h3>
              <p className="mt-1 font-black text-[#5b3710]">You&apos;ve finished every quest for today.</p>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-2xl border-2 px-[3cqw] py-[2cqw] shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_4px_7px_rgba(80,35,5,0.3)]"
                style={{ borderColor: layout.questCardBorder, backgroundColor: layout.questCardBg }}
              >
                {/* Icon + title */}
                <div className="flex min-w-0 items-center gap-[2.5cqw]">
                  <div
                    className="flex shrink-0 items-center justify-center"
                    style={{ width: "9cqw", height: "9cqw", fontSize: "6cqw" }}
                  >
                    {getQuestIcon(task.title)}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="truncate font-black leading-tight text-[#3a2108]"
                      style={{ fontSize: "clamp(11px, 3.5cqw, 18px)" }}
                    >
                      {task.title}
                    </h3>
                    <p className="font-black text-[#5b3710]" style={{ fontSize: "clamp(10px, 2.8cqw, 14px)" }}>
                      +{task.points} XP
                    </p>
                  </div>
                </div>

                {/* Complete button */}
                <button
                  onClick={() => onComplete(task.id, task.points)}
                  className="flex shrink-0 items-center justify-center rounded-full border-2 border-[#2d5f12] bg-green-600 font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_3px_4px_rgba(60,30,5,0.35)] hover:bg-green-700 active:scale-95"
                  style={{ width: "9cqw", height: "9cqw", fontSize: "5cqw" }}
                >
                  ✓
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer link */}
        <button
          className={`${cinzel.className} absolute bottom-[10%] left-[16%] right-[16%] text-center font-black uppercase tracking-wide text-yellow-100 drop-shadow-[0_2px_1px_rgba(60,15,0,0.9)]`}
          style={{ fontSize: "clamp(12px, 4cqw, 22px)" }}
        >
          View All Quests
        </button>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ADVENTURE MAP
// Scales via aspect-ratio + container queries.
// Map levels use percentage positioning so they
// stay in place regardless of rendered width.
// ─────────────────────────────────────────────
const MAP_LEVELS = [
  {
    level: 5, name: "Level 5",
    left: 18, top: 48,
    icon: assets.levelIconBlue,
banner: assets.levelBannerBlue,
    iconPct: 16, bannerPct: 12, bannerOffsetPct: -7, textOffset: "0px",
  },
  {
    level: 6, name: "Level 6",
    left: 38, top: 64,
    icon: assets.levelIconRed,
banner: assets.levelBannerBlue,
    iconPct: 16, bannerPct: 12, bannerOffsetPct: -7, textOffset: "0px",
  },
  {
    level: 7, name: "Level 7",
    left: 60, top: 38,
    icon: assets.levelNext,
banner: assets.levelBannerRed,
    iconPct: 15, bannerPct: 12.5, bannerOffsetPct: -10, textOffset: "-0.4cqw",
  },
  {
    level: 8, name: "Level 8",
    left: 78, top: 62,
    icon: assets.levelIconLocked,
banner: assets.levelBannerBrown,
    iconPct: 11, bannerPct: 12, bannerOffsetPct: -5.5, textOffset: "0px",
  },
] as const;

function AdventureMap({ points }: { points: number }) {
  return (
    /* container-type so cqw resolves to this element's width */
    <section className="relative w-full [container-type:inline-size]">
      <div className="relative aspect-[16/10] w-full">

        {/* Decorative frame (outermost, z-10) */}
        <img
          src={assets.adventureFrame}
          alt=""
          className="absolute inset-0 z-10 h-full w-full object-fill"
        />

        {/* Top banner */}
        <div className="absolute left-1/2 top-[-11.5%] z-50 flex h-[36%] w-[65%] -translate-x-1/2 items-center">
          <img src={assets.mapTopBanner} alt="" className="h-full w-full object-fill" />
          <p
            className={`${cinzel.className} absolute inset-0 flex items-center justify-center font-black uppercase text-yellow-100`}
            style={{ fontSize: "clamp(10px, 1.5cqw, 24px)", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            YOUR ADVENTURE
          </p>
        </div>

        {/* Bottom banner */}
        <div className="absolute bottom-[-10.1%] left-1/2 z-50 flex h-[30%] w-[65%] -translate-x-1/2 items-center">
          <img src={assets.mapBottomBanner} alt="" className="h-full w-full object-fill" />
          <p
            className={`${cinzel.className} absolute inset-0 flex items-center justify-center font-black text-[#4a2408]`}
            style={{ fontSize: "clamp(8px, 1.3cqw, 20px)" }}
          >
            You&apos;re on a roll, Captain! 🏴‍☠️
          </p>
        </div>

        {/* Ocean / map interior */}
        <div className="absolute left-[6%] top-[7%] z-20 h-[86%] w-[88%] overflow-hidden [container-type:inline-size]">
          <img src={assets.adventureOcean} alt="" className="absolute inset-0 h-full w-full object-fill" />

          {/* Dashed path line */}
          <svg className="absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 16 48 C 24 54, 30 66, 38 64 S 52 42, 60 42 S 74 64, 82 62"
              fill="none"
              stroke="#f5d28a"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              strokeLinecap="round"
            />
          </svg>

          {/* Level markers */}
          {MAP_LEVELS.map((item) => (
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
                  style={{ width: `${item.iconPct}cqw` }}
                />
              </div>

              <div
                className="relative"
                style={{
                  marginTop: `${item.bannerOffsetPct}cqw`,
                  width: `${item.bannerPct}cqw`,
                }}
              >
                <img src={item.banner} alt="" className="w-full object-contain" />
                <p
                  className="absolute inset-0 flex items-center justify-center font-black uppercase text-yellow-100"
                  style={{
                    fontSize: "clamp(6px, 0.8cqw, 9px)",
                    transform: `translateY(${item.textOffset})`,
                  }}
                >
                  {item.name}
                </p>
              </div>
            </div>
          ))}

          {/* Boat */}
          <img
            src={assets.mapBoat}
            alt=""
            className="absolute left-1/2 top-[56%] z-40 w-[40%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-xl"
          />

          {/* Atmospheric overlays */}
          <div className="pointer-events-none absolute inset-0 z-50 bg-[#d8c18d]/10 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 z-50 shadow-[inset_0_0_40px_rgba(70,40,15,0.25)]" />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// REWARD SHOP PREVIEW
// 4-column grid that collapses to 2 on mobile.
// cqw units resolve to this element's width.
// ─────────────────────────────────────────────
function RewardShopPreview({ rewards, pendingRewards, onRedeem }: {
  rewards: any[];
  pendingRewards: any[];
  onRedeem: (id: string) => Promise<void>;
}) {
  return (
    <section className="relative w-full overflow-hidden [container-type:inline-size]">
      {/* Background */}
      <img src={assets.rewardShopBg} alt="" className="absolute inset-0 h-full w-full object-fill" />

      <div className="relative z-10 px-[3cqw] pb-[2.5cqw] pt-[4cqw]">
        {/* Header */}
        <div className="mb-[2cqw] flex items-center justify-between px-[1cqw]">
          <h2
            className={`${cinzel.className} font-black uppercase text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]`}
            style={{ fontSize: "clamp(14px, 2cqw, 30px)" }}
          >
            Reward Shop
          </h2>
          <button
            className="font-black uppercase text-yellow-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            style={{ fontSize: "clamp(9px, 1.1cqw, 15px)" }}
          >
            View All
          </button>
        </div>

        {/* Cards grid: 2 cols mobile → 4 cols at wider widths */}
        <div className="grid grid-cols-2 gap-[1.5cqw] sm:grid-cols-4">
          {rewards.slice(0, 4).map((reward) => {
            const isPending = pendingRewards.some((r) => r.reward_id === reward.id);

            return (
              <div key={reward.id} className="relative" style={{ aspectRatio: "1 / 1.35" }}>
                {/* Card background */}
                <img src={assets.rewardCard} alt="" className="absolute inset-0 h-full w-full object-fill" />

                {/* Reward image */}
                <img
                  src={reward.image_url}
                  alt={reward.title}
                  className="absolute left-1/2 top-[2%] -translate-x-1/2 object-contain drop-shadow-xl"
                  style={{ width: "65%", height: "55%", objectFit: "contain" }}
                />

                {/* Title */}
                <h3
                  className="absolute left-1/2 w-[90%] -translate-x-1/2 px-1 text-center font-black leading-tight"
                  style={{
                    bottom: "30%",
                    fontSize: "clamp(10px, 1.3cqw, 18px)",
                    color: layout.rewardCardTextColor,
                  }}
                >
                  {reward.title}
                </h3>

                {/* Redeem button */}
                <button
                  onClick={() => onRedeem(reward.id)}
                  disabled={isPending}
                  className="absolute left-1/2 -translate-x-1/2 active:scale-95 disabled:opacity-60"
                  style={{ bottom: "3%", width: "70%", aspectRatio: "2 / 0.7" }}
                >
                  <img src={assets.redeemButton} alt="" className="h-full w-full object-fill" />
                  <span className="absolute inset-0 flex items-center justify-center gap-[0.4cqw]">
                    <img
                      src={assets.doubloon}
                      alt=""
                      className="object-contain"
                      style={{ width: "3.5cqw", height: "3.5cqw" }}
                    />
                    <span
                      className={`${cinzel.className} font-black text-yellow-100`}
                      style={{ fontSize: "clamp(10px, 1.15cqw, 16px)" }}
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

// ─────────────────────────────────────────────
// RECENT ACHIEVEMENTS
// ─────────────────────────────────────────────
function RecentAchievements() {
  return (
    <section className="rounded-3xl border-4 border-yellow-800 bg-yellow-100 p-4 text-slate-950 shadow-xl">
      <h2 className="mb-3 text-2xl font-black text-amber-900">🏆 Recent Achievements</h2>
      <div className="rounded-2xl border-2 border-yellow-700 bg-yellow-50 p-4">
        <p className="font-black text-slate-800">Complete quests to unlock achievements.</p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getQuestIcon(title: string) {
  const n = title.toLowerCase();
  if (n.includes("bed"))                      return "🛏️";
  if (n.includes("read"))                     return "📖";
  if (n.includes("teeth") || n.includes("brush")) return "🦷";
  if (n.includes("football"))                 return "⚽";
  if (n.includes("homework"))                 return "📚";
  if (n.includes("school"))                   return "🎒";
  if (n.includes("room"))                     return "🧹";
  if (n.includes("dish"))                     return "🍽️";
  if (n.includes("kind"))                     return "💛";
  if (n.includes("good"))                     return "⭐";
  return "📜";
}
