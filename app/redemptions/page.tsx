"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Redemption = {
  id: string;
  status: string;
  child_id: string;
  reward_id: string;
  children: {
    name: string;
    points: number;
  }[];
  rewards: {
    title: string;
    cost: number;
  }[];
};

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    fetchRedemptions();
  }, []);

  async function fetchRedemptions() {
    const { data, error } = await supabase
      .from("redemptions")
      .select(`
        id,
        status,
        child_id,
        reward_id,
        children (
          name,
          points
        ),
        rewards (
          title,
          cost
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setRedemptions(data || []);
  }

  async function approveRedemption(redemption: Redemption) {
    const newPoints =
      redemption.children[0]?.points - redemption.rewards[0]?.cost;

    if (newPoints < 0) {
      alert("Not enough points anymore");
      return;
    }

    const { error: childError } = await supabase
      .from("children")
      .update({ points: newPoints })
      .eq("id", redemption.child_id);

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
    fetchRedemptions();
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
    fetchRedemptions();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Redemption Queue</h1>

        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div
              key={redemption.id}
              className="rounded-2xl bg-slate-900 p-5"
            >
              <p className="text-lg font-bold">
                {redemption.children[0]?.name
} requested{" "}
                {redemption.rewards[0]?.title}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Cost: {redemption.rewards[0]?.cost} points
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Current points: {redemption.children[0]?.points}
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
          ))}

          {redemptions.length === 0 && (
            <p className="text-slate-400">No redemption requests yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}