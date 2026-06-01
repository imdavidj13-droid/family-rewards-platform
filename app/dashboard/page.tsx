"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { themes } from "@/lib/themes";

type Child = {
  id: string;
  name: string;
  points: number;
};

type Activity = {
  id: string;
  status: string;
  child_id: string;
  reward_id: string;
  childName?: string;
  rewardTitle?: string;
};

export default function DashboardPage() {
const theme = themes.trophyGold;
  const [childrenCount, setChildrenCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [topChild, setTopChild] = useState<Child | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { count: children } = await supabase
      .from("children")
      .select("*", { count: "exact", head: true });

    const { count: tasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    const { count: rewards } = await supabase
      .from("rewards")
      .select("*", { count: "exact", head: true });

    const { count: pending } = await supabase
      .from("redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
      const { data: topChildData } = await supabase
  .from("children")
  .select("id, name, points")
  .order("points", { ascending: false })
  .limit(1)
  .single();

  const { data: activityData } = await supabase
  .from("redemptions")
  .select("id, status, child_id, reward_id")
  .order("created_at", { ascending: false })
  .limit(5);

const { data: childrenData } = await supabase
  .from("children")
  .select("id, name");

const { data: rewardsData } = await supabase
  .from("rewards")
  .select("id, title");

const enrichedActivities =
  activityData?.map((activity) => {
    const child = childrenData?.find((c) => c.id === activity.child_id);
    const reward = rewardsData?.find((r) => r.id === activity.reward_id);

    return {
      ...activity,
      childName: child?.name || "Someone",
      rewardTitle: reward?.title || "a reward",
    };
  }) || [];

setActivities(enrichedActivities);

setTopChild(topChildData || null);

    setChildrenCount(children || 0);
    setTasksCount(tasks || 0);
    setRewardsCount(rewards || 0);
    setPendingCount(pending || 0);
  }

  return (
    <main className={`min-h-screen ${theme.background} ${theme.pageText} p-6`}>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-black">
          Family Rewards Dashboard
        </h1>

        <p className="mb-8 text-slate-400">
          Manage your family rewards platform.
        </p>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className={`rounded-3xl border ${theme.statChildren} p-6 shadow-xl`}>
            <div className="text-4xl">👦</div>
            <p className="mt-2 text-slate-400">Children</p>
            <h2 className="text-4xl font-black">{childrenCount}</h2>
          </div>

          <div className={`rounded-3xl border ${theme.statTasks} p-6 shadow-xl`}>
            <div className="text-4xl">📋</div>
            <p className="mt-2 text-slate-400">Tasks</p>
            <h2 className="text-4xl font-black">{tasksCount}</h2>
          </div>

          <div className={`rounded-3xl border ${theme.statRewards} p-6 shadow-xl`}>
            <div className="text-4xl">🎁</div>
            <p className="mt-2 text-slate-400">Rewards</p>
            <h2 className="text-4xl font-black">{rewardsCount}</h2>
          </div>

         <div className={`rounded-3xl border ${theme.statPending} p-6 shadow-xl`}>
            <div className="text-4xl">⏳</div>
            <p className="mt-2 text-slate-400">Pending</p>
            <h2 className="text-4xl font-black">{pendingCount}</h2>
          </div>
        </div>

        {topChild && (
<div className={`mb-10 rounded-3xl border ${theme.championCard} p-6 shadow-xl`}>
    <p className="mb-2 text-slate-400">⭐ Champion Child</p>

    <h2 className="text-3xl font-black">
      {topChild.name}
    </h2>

    <p className="mt-2 text-xl font-bold text-yellow-300">
      {Number(topChild.points || 0)} points
    </p>
  </div>
)}

<div className={`mb-10 rounded-3xl border ${theme.championCard} p-6 shadow-xl`}></div><div className={`mb-10 rounded-3xl border ${theme.activityCard} p-6 shadow-xl`}>
  <p className="mb-4 text-xl font-bold">🔥 Recent Activity</p>

  <div className="space-y-3">
    {activities.map((activity) => (
      <div
        key={activity.id}
        className="rounded-2xl bg-slate-800 p-4 text-slate-300"
      >
        {activity.status === "approved" && "✅"}
{activity.status === "rejected" && "❌"}
{activity.status === "pending" && "🎁"}{" "}
{activity.childName} requested {activity.rewardTitle} - {activity.status}
      </div>
    ))}

    {activities.length === 0 && (
      <p className="text-slate-400">No recent activity yet.</p>
    )}
  </div>
</div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/children"
            className={`rounded-3xl border ${theme.navCard} p-6 shadow-xl transition`}
          >
            <div className="mb-4 text-5xl">👦</div>
            <h2 className="text-2xl font-bold">Children</h2>
          </Link>

          <Link
            href="/tasks"
            className={`rounded-3xl border ${theme.navCard} p-6 shadow-xl transition`}
          >
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-bold">Tasks</h2>
          </Link>

          <Link
            href="/rewards"
            className={`rounded-3xl border ${theme.navCard} p-6 shadow-xl transition`}
          >
            <div className="mb-4 text-5xl">🎁</div>
            <h2 className="text-2xl font-bold">Rewards</h2>
          </Link>

          <Link
            href="/redemptions"
            className={`rounded-3xl border ${theme.navCard} p-6 shadow-xl transition`}
          >
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-2xl font-bold">Approvals</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}