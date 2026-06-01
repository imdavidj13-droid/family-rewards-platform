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

type Redemption = {
  id: string;
  status: string;
  child_id: string;
  reward_id: string;
};

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: redemptionData, error: redemptionError } = await supabase
      .from("redemptions")
      .select("id, status, child_id, reward_id")
      .order("created_at", { ascending: false });

    if (redemptionError) {
      alert(redemptionError.message);
      return;
    }

    const { data: childrenData, error: childrenError } = await supabase
      .from("children")
      .select("id, name, points");

    if (childrenError) {
      alert(childrenError.message);
      return;
    }

    const { data: rewardsData, error: rewardsError } = await supabase
      .from("rewards")
      .select("id, title, cost");

    if (rewardsError) {
      alert(rewardsError.message);
      return;
    }

    setRedemptions(redemptionData || []);
    setChildren(childrenData || []);
    setRewards(rewardsData || []);
  }

  async function approveRedemption(redemption: Redemption) {
    const child = children.find((c) => c.id === redemption.child_id);
    const reward = rewards.find((r) => r.id === redemption.reward_id);

    if (!child || !reward) {
      alert("Could not find child or reward");
      return;
    }

    const currentPoints = Number(child.points ?? 0);
    const rewardCost = Number(reward.cost ?? 0);
    const newPoints = currentPoints - rewardCost;

    if (newPoints < 0) {
      alert("Not enough points anymore");
      return;
    }

    const { error: childError } = await supabase
      .from("children")
      .update({ points: newPoints })
      .eq("id", child.id);

    if (childError) {
      alert(childError.message);
      return;
    }

    const { error: redemptionError } = await supabase
      .from("redemptions")
      .update({ status: "approved" })
      .eq("id", redemption.id);

    if (redemptionError) {
      alert(redemptionError.message);
      return;
    }

    alert("Reward approved!");
    fetchData();
  }

  async function rejectRedemption(redemption: Redemption) {
    const { error } = await supabase
      .from("redemptions")
      .update({ status: "rejected" })
      .eq("id", redemption.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Reward rejected");
    fetchData();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Redemption Queue</h1>

        <div className="space-y-4">
          {redemptions.map((redemption) => {
            const child = children.find((c) => c.id === redemption.child_id);
            const reward = rewards.find((r) => r.id === redemption.reward_id);

            return (
              <div key={redemption.id} className="rounded-2xl bg-slate-900 p-5">
                <p className="text-lg font-bold">
                  {child?.name || "Unknown child"} requested{" "}
                  {reward?.title || "Unknown reward"}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Cost: {Number(reward?.cost ?? 0)} points
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Current points: {Number(child?.points ?? 0)}
                </p>

                <p className="mt-2 text-sm font-bold">
                  Status: {redemption.status}
                </p>

                {redemption.status === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => approveRedemption(redemption)}
                      className="rounded-xl bg-green-600 px-4 py-2 font-bold hover:bg-green-500"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRedemption(redemption)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {redemptions.length === 0 && (
            <p className="text-slate-400">No redemption requests yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}