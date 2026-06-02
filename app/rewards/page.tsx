"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import Toast from "@/components/Toast";

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
  const { theme } = useTheme();

  const [children, setChildren] = useState<Child[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [toast, setToast] = useState<{
  type: "success" | "error" | "info";
  message: string;
} | null>(null);

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
      setToast({
  type: "error",
  message: error.message,
});
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
      setToast({
  type: "error",
  message: error.message,
});
      return;
    }

    setRewards(data || []);
  }

  async function createReward() {
    if (!title || !cost) {
      setToast({
  type: "error",
  message: "Please fill in all fields",
});
      return;
    }

    const { error } = await supabase.from("rewards").insert({
      title,
      cost: Number(cost),
    });

    if (error) {
      setToast({
  type: "error",
  message: error.message,
});
      return;
    }

    setTitle("");
    setCost("");
    fetchRewards();
  }

  async function redeemReward(reward: Reward) {
    const child = children.find((c) => c.id === selectedChildId);

    if (!child) {
      setToast({
  type: "error",
  message: "Choose a child first",
});
      return;
    }

    if (child.points < reward.cost) {
      setToast({
  type: "error",
  message: `${child.name} does not have enough points`,
});
      return;
    }

    const { error } = await supabase.from("redemptions").insert({
      child_id: child.id,
      reward_id: reward.id,
      status: "pending",
    });

    if (error) {
      setToast({
  type: "error",
  message: error.message,
});
      return;
    }

    setToast({
  type: "success",
  message: `${child.name} requested ${reward.title}!`,
});
    fetchChildren();
  }

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Rewards Shop 🎁
              </h1>

              <p className={`mt-2 ${theme.mutedText}`}>
                Create rewards and let children request them using their points.
              </p>
            </div>

            <div
              className={`w-fit rounded-xl border ${theme.border} ${theme.cardBg} px-4 py-2 text-sm font-bold ${theme.mutedText} shadow-sm`}
            >
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
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="text-xl font-black">Create Reward</h2>

              <p className={`mt-1 text-sm ${theme.mutedText}`}>
                Add something your child can request.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Reward e.g. 30 mins Xbox"
                  className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none ${theme.focusBorder}`}
                />

                <input
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Cost e.g. 100"
                  type="number"
                  className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none ${theme.focusBorder}`}
                />

                <button
                  onClick={createReward}
                  className={`w-full rounded-2xl px-5 py-4 font-black transition ${theme.button}`}
                >
                  ＋ Add Reward
                </button>
              </div>
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="text-xl font-black">Choose Child</h2>

              <p className={`mt-1 text-sm ${theme.mutedText}`}>
                Select who is requesting a reward.
              </p>

              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className={`mt-6 w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none ${theme.focusBorder}`}
              >
                <option value="">Choose child redeeming reward</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.points} points
                  </option>
                ))}
              </select>

              <div className={`mt-6 rounded-2xl ${theme.softBg} p-5`}>
                <p className={`text-sm font-bold ${theme.mutedText}`}>
                  Selected Child
                </p>

                <p className="mt-2 text-2xl font-black">
                  {selectedChildId
                    ? children.find((child) => child.id === selectedChildId)?.name
                    : "None selected"}
                </p>

                {selectedChildId && (
                  <p className={`mt-1 font-bold ${theme.primaryText}`}>
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

          <h2 className="mb-4 text-xl font-black">Available Rewards</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm transition hover:-translate-y-1 ${theme.hoverBorder} hover:shadow-md`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-4xl`}
                  >
                    🎁
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-black ${theme.warningBg} ${theme.warningText}`}
                  >
                    Reward
                  </div>
                </div>

                <h2 className="text-2xl font-black">{reward.title}</h2>

                <p className={`mt-1 text-sm ${theme.mutedText}`}>
                  Available in the reward shop
                </p>

                <div className={`mt-5 rounded-2xl ${theme.softBg} p-4`}>
                  <p className={`text-sm font-bold ${theme.mutedText}`}>Cost</p>

                  <p className={`mt-1 text-3xl font-black ${theme.primaryText}`}>
                    ⭐ {Number(reward.cost || 0)}
                  </p>
                </div>

                <button
                  onClick={() => redeemReward(reward)}
                  className={`mt-5 w-full rounded-2xl px-4 py-3 font-black transition ${theme.button}`}
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
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-5 shadow-sm`}
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${
          orange ? theme.warningBg : theme.iconBg
        }`}
      >
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>

      <h2 className="mt-2 text-3xl font-black">{value}</h2>
    </div>
  );
}