"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

type Child = {
  id: string;
  name: string;
  points: number;
};

type Reward = {
  id: string;
  title: string;
  cost: number;
};

export default function RewardsPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");

  useEffect(() => {
    fetchChildren();
    fetchRewards();
  }, []);

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("id, name, points")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setChildren(data || []);
  }

  async function fetchRewards() {
    const { data, error } = await supabase
      .from("rewards")
      .select("id, title, cost")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setRewards(data || []);
  }

  async function createReward() {
    if (!title || !cost) {
      alert("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("rewards").insert({
      title,
      cost: Number(cost),
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setCost("");
    fetchRewards();
  }

  async function redeemReward(reward: Reward) {
    const child = children.find((c) => c.id === selectedChildId);

    if (!child) {
      alert("Choose a child first");
      return;
    }

    if (child.points < reward.cost) {
      alert(`${child.name} does not have enough points`);
      return;
    }

    const { error } = await supabase.from("redemptions").insert({
      child_id: child.id,
      reward_id: reward.id,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(`${child.name} requested ${reward.title}!`);
    fetchChildren();
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Rewards Shop 🎁
              </h1>

              <p className="mt-2 text-gray-500">
                Create rewards and let children request them using their points.
              </p>
            </div>

            <div className="w-fit rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
              {rewards.length} Rewards
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="🎁" label="Rewards" value={rewards.length} />
            <StatCard
              icon="⭐"
              label="Cheapest Reward"
              value={
                rewards.length > 0
                  ? Math.min(...rewards.map((reward) => Number(reward.cost || 0)))
                  : 0
              }
            />
            <StatCard
              icon="🏆"
              label="Most Expensive"
              value={
                rewards.length > 0
                  ? Math.max(...rewards.map((reward) => Number(reward.cost || 0)))
                  : 0
              }
              orange
            />
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Create Reward
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add something your child can request.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-600">
                    Reward name
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 30 mins Xbox"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-600">
                    Cost
                  </label>

                  <input
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="e.g. 100"
                    type="number"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-600 focus:bg-white"
                  />
                </div>

                <button
                  onClick={createReward}
                  className="w-full rounded-2xl bg-red-600 px-5 py-4 font-black text-white transition hover:bg-red-700"
                >
                  ＋ Add Reward
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Choose Child
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select who is requesting a reward.
              </p>

              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="mt-6 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-900 outline-none transition focus:border-red-600 focus:bg-white"
              >
                <option value="">Choose child redeeming reward</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.points} points
                  </option>
                ))}
              </select>

              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-bold text-gray-500">
                  Selected Child
                </p>

                <p className="mt-2 text-2xl font-black text-gray-900">
                  {selectedChildId
                    ? children.find((child) => child.id === selectedChildId)
                        ?.name
                    : "None selected"}
                </p>

                {selectedChildId && (
                  <p className="mt-1 font-bold text-red-600">
                    ⭐{" "}
                    {
                      children.find((child) => child.id === selectedChildId)
                        ?.points
                    }{" "}
                    points
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">
              Available Rewards
            </h2>
          </div>

          {rewards.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                🎁
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                No rewards yet
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first reward to start building the shop.
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl">
                    🎁
                  </div>

                  <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                    Reward
                  </div>
                </div>

                <h2 className="text-2xl font-black text-gray-900">
                  {reward.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Available in the reward shop
                </p>

                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-500">Cost</p>

                  <p className="mt-1 text-3xl font-black text-red-600">
                    ⭐ {Number(reward.cost || 0)}
                  </p>
                </div>

                <button
                  onClick={() => redeemReward(reward)}
                  className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 font-black text-white transition hover:bg-red-700"
                >
                  Request Reward
                </button>
              </div>
            ))}
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
          orange ? "bg-orange-100" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>

      <h2 className="mt-2 text-3xl font-black text-gray-900">{value}</h2>
    </div>
  );
}