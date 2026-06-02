"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

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
  const [childrenCount, setChildrenCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { count: childrenTotal } = await supabase
      .from("children")
      .select("*", { count: "exact", head: true });

    const { count: tasksTotal } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    const { count: rewardsTotal } = await supabase
      .from("rewards")
      .select("*", { count: "exact", head: true });

    const { count: pendingTotal } = await supabase
      .from("redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { data: childrenData } = await supabase
      .from("children")
      .select("id, name, points")
      .order("points", { ascending: false });

    const { data: activityData } = await supabase
      .from("redemptions")
      .select("id, status, child_id, reward_id")
      .order("created_at", { ascending: false })
      .limit(5);

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

    setChildrenCount(childrenTotal || 0);
    setTasksCount(tasksTotal || 0);
    setRewardsCount(rewardsTotal || 0);
    setPendingCount(pendingTotal || 0);
    setChildren(childrenData || []);
    setActivities(enrichedActivities);
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
    <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Good morning 👋
              </h1>

              <p className="mt-2 text-gray-500">
                Here's what's happening in your family today.
              </p>
            </div>

            <div className="w-fit rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
              Today
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <StatCard icon="⭐" label="Total Points" value={children.reduce((sum, child) => sum + Number(child.points || 0), 0)} />
            <StatCard icon="✅" label="Tasks" value={tasksCount} />
            <StatCard icon="🎁" label="Rewards" value={rewardsCount} />
            <StatCard icon="⏳" label="Pending" value={pendingCount} orange />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-black">Your Children</h2>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
                          🧒
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-black">{child.name}</p>
                            <p className="text-sm font-black text-red-600">
                              {Number(child.points || 0)} pts
                            </p>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-red-600"
                              style={{
                                width: `${Math.min(Number(child.points || 0), 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600 sm:block">
                          🔥 Streak
                        </div>
                      </div>
                    ))}

                    {children.length === 0 && (
                      <p className="text-gray-500">No children added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-black">Recent Activity</h2>

                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">
                        <p className="font-bold text-gray-800">
                          {activity.status === "approved" && "✅"}
                          {activity.status === "rejected" && "❌"}
                          {activity.status === "pending" && "🎁"}{" "}
                          {activity.childName} requested{" "}
                          <span className="font-black">
                            {activity.rewardTitle}
                          </span>
                        </p>

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
                      <p className="text-gray-500">No recent activity yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-black">Quick Actions</h2>

              <div className="space-y-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <Link href="/tasks" className="block rounded-2xl bg-red-600 px-4 py-3 text-center font-black text-white hover:bg-red-700">
                  ＋ Add Task
                </Link>

                <Link href="/rewards" className="block rounded-2xl bg-red-600 px-4 py-3 text-center font-black text-white hover:bg-red-700">
                  ＋ Add Reward
                </Link>

                <Link href="/redemptions" className="block rounded-2xl border-2 border-red-600 bg-white px-4 py-3 text-center font-black text-red-600 hover:bg-red-50">
                  ✅ Approvals
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  orange = false,
}: {
  icon: string;
  label: string;
  value: number;
  orange?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${
          orange ? "bg-orange-100" : "bg-red-100"
        }`}
      >
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>

      <h2 className="mt-2 text-3xl font-black text-gray-900">{value}</h2>
    </div>
  );
}