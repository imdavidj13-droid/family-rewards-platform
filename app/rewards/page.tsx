"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Rewards Shop</h1>

        <div className="mb-8 rounded-2xl bg-slate-900 p-5">
          <h2 className="mb-4 text-xl font-semibold">Create reward</h2>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reward e.g. 30 mins Xbox"
              className="w-full rounded-xl bg-slate-800 p-3 outline-none"
            />

            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost e.g. 100"
              type="number"
              className="w-full rounded-xl bg-slate-800 p-3 outline-none"
            />

            <button
              onClick={createReward}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
            >
              Add reward
            </button>
          </div>
        </div>

        <div className="mb-6">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full rounded-xl bg-slate-800 p-3 outline-none"
          >
            <option value="">Choose child redeeming reward</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.points} points
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {rewards.map((reward) => (
            <div key={reward.id} className="rounded-2xl bg-slate-900 p-5">
              <h2 className="mb-2 text-xl font-bold">{reward.title}</h2>

              <p className="mb-4 text-green-300">
                ⭐ {reward.cost} points
              </p>

              <button
                onClick={() => redeemReward(reward)}
className="rounded-xl bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-500"              >
                Redeem
              </button>
            </div>
          ))}

          {rewards.length === 0 && (
            <p className="text-slate-400">No rewards yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}