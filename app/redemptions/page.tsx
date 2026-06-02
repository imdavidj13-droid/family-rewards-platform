"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";
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

type Redemption = {
  id: string;
  status: string;
  child_id: string;
  reward_id: string;
};

export default function RedemptionsPage() {
  const { theme } = useTheme();

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
      .eq("status", "pending")
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
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Reward Requests ✅
              </h1>

              <p className="mt-2 text-gray-500">
                Approve or reject rewards requested by children.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
              {redemptions.length} Pending
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="⏳" label="Pending" value={redemptions.length} orange />
            <StatCard icon="👦" label="Children" value={children.length} />
            <StatCard icon="🎁" label="Rewards" value={rewards.length} />
          </div>

          {redemptions.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                ✅
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                No pending requests
              </h2>

              <p className="mt-2 text-gray-500">
                All reward requests have been processed.
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {redemptions.map((redemption) => {
              const child = children.find((c) => c.id === redemption.child_id);
              const reward = rewards.find((r) => r.id === redemption.reward_id);

              return (
                <div
                  key={redemption.id}
                  className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md ${theme.pageText}`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl">
                      🎁
                    </div>

                    <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                      Pending
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900">
                    {reward?.title || "Unknown Reward"}
                  </h2>

                  <p className="mt-2 text-gray-500">Requested by</p>

                  <p className="font-black text-red-600">
                    {child?.name || "Unknown Child"}
                  </p>

                  <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-500">Cost</span>

                      <span className="font-black text-gray-900">
                        ⭐ {Number(reward?.cost ?? 0)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-bold text-gray-500">
                        Current Points
                      </span>

                      <span className="font-black text-gray-900">
                        {Number(child?.points ?? 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => approveRedemption(redemption)}
                      className="rounded-2xl bg-green-600 px-4 py-3 font-black text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRedemption(redemption)}
                      className="rounded-2xl bg-red-600 px-4 py-3 font-black text-white transition hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
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