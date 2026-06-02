"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { themes } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";

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
  const { selectedTheme, changeTheme } = useTheme();

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

    setChildrenCount(children || 0);
    setTasksCount(tasks || 0);
    setRewardsCount(rewards || 0);
    setPendingCount(pending || 0);
    setTopChild(topChildData || null);
    setActivities(enrichedActivities);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-4xl font-black text-red-600">
              Family Rewards Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your family rewards platform.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
            Today
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {Object.keys(themes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => changeTheme(themeName as keyof typeof themes)}
              className={`rounded-xl px-4 py-2 font-bold transition ${
                selectedTheme === themeName
                  ? "bg-red-600 text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {themeName}
            </button>
          ))}
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
              👦
            </div>
            <p className="text-sm font-bold text-gray-500">Children</p>
            <h2 className="mt-2 text-4xl font-black text-gray-900">
              {childrenCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
              📋
            </div>
            <p className="text-sm font-bold text-gray-500">Tasks</p>
            <h2 className="mt-2 text-4xl font-black text-gray-900">
              {tasksCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
              🎁
            </div>
            <p className="text-sm font-bold text-gray-500">Rewards</p>
            <h2 className="mt-2 text-4xl font-black text-gray-900">
              {rewardsCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              ⏳
            </div>
            <p className="text-sm font-bold text-gray-500">Pending</p>
            <h2 className="mt-2 text-4xl font-black text-gray-900">
              {pendingCount}
            </h2>
          </div>
        </div>

        {topChild && (
          <div className="mb-10 rounded-3xl bg-gradient-to-r from-red-600 to-red-500 p-8 text-white shadow-xl">
            <p className="mb-2 text-red-100">❤️ Champion Child</p>

            <h2 className="text-4xl font-black">{topChild.name}</h2>

            <p className="mt-3 text-2xl font-bold">
              ⭐ {Number(topChild.points || 0)} points
            </p>
          </div>
        )}

        <div className="mb-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">
              Recent Activity
            </h2>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              Latest
            </span>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="font-bold text-gray-800">
                  {activity.status === "approved" && "✅"}
                  {activity.status === "rejected" && "❌"}
                  {activity.status === "pending" && "🎁"}{" "}
                  {activity.childName} requested {activity.rewardTitle}
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                    activity.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : activity.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="rounded-2xl bg-gray-50 p-4 text-gray-500">
                No recent activity yet.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/children"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-3xl">
              👦
            </div>
            <h2 className="text-2xl font-black text-gray-900">Children</h2>
            <p className="mt-2 text-sm text-gray-500">Manage family members</p>
          </Link>

          <Link
            href="/tasks"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-3xl">
              📋
            </div>
            <h2 className="text-2xl font-black text-gray-900">Tasks</h2>
            <p className="mt-2 text-sm text-gray-500">Create and complete tasks</p>
          </Link>

          <Link
            href="/rewards"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-3xl">
              🎁
            </div>
            <h2 className="text-2xl font-black text-gray-900">Rewards</h2>
            <p className="mt-2 text-sm text-gray-500">Build the reward shop</p>
          </Link>

          <Link
            href="/redemptions"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
              ✅
            </div>
            <h2 className="text-2xl font-black text-gray-900">Approvals</h2>
            <p className="mt-2 text-sm text-gray-500">Approve reward requests</p>
          </Link>
        </div>
      </div>
    </main>
  );
}