"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Child = {
  id: string;
  name: string;
  points: number;
};

export default function DashboardPage() {
  const [childrenCount, setChildrenCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [topChild, setTopChild] = useState<Child | null>(null);

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

setTopChild(topChildData || null);

    setChildrenCount(children || 0);
    setTasksCount(tasks || 0);
    setRewardsCount(rewards || 0);
    setPendingCount(pending || 0);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-black">
          Family Rewards Dashboard
        </h1>

        <p className="mb-8 text-slate-400">
          Manage your family rewards platform.
        </p>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-slate-900 p-6">
            <div className="text-4xl">👦</div>
            <p className="mt-2 text-slate-400">Children</p>
            <h2 className="text-4xl font-black">{childrenCount}</h2>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <div className="text-4xl">📋</div>
            <p className="mt-2 text-slate-400">Tasks</p>
            <h2 className="text-4xl font-black">{tasksCount}</h2>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <div className="text-4xl">🎁</div>
            <p className="mt-2 text-slate-400">Rewards</p>
            <h2 className="text-4xl font-black">{rewardsCount}</h2>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6">
            <div className="text-4xl">⏳</div>
            <p className="mt-2 text-slate-400">Pending</p>
            <h2 className="text-4xl font-black">{pendingCount}</h2>
          </div>
        </div>

        {topChild && (
  <div className="mb-10 rounded-3xl bg-slate-900 p-6">
    <p className="mb-2 text-slate-400">⭐ Top Child</p>

    <h2 className="text-3xl font-black">
      {topChild.name}
    </h2>

    <p className="mt-2 text-xl font-bold text-yellow-300">
      {Number(topChild.points || 0)} points
    </p>
  </div>
)}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/children"
            className="rounded-3xl bg-slate-900 p-6 hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">👦</div>
            <h2 className="text-2xl font-bold">Children</h2>
          </Link>

          <Link
            href="/tasks"
            className="rounded-3xl bg-slate-900 p-6 hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-bold">Tasks</h2>
          </Link>

          <Link
            href="/rewards"
            className="rounded-3xl bg-slate-900 p-6 hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">🎁</div>
            <h2 className="text-2xl font-bold">Rewards</h2>
          </Link>

          <Link
            href="/redemptions"
            className="rounded-3xl bg-slate-900 p-6 hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-2xl font-bold">Approvals</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}