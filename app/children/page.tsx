"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import RequireRole from "@/components/RequireRole";

type Child = {
  id: string;
  name: string;
  points: number;
};

export default function ChildrenPage() {
  const { theme } = useTheme();

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("id, name, points")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChildren(data || []);
    setLoading(false);
  }

  const totalPoints = children.reduce(
    (sum, child) => sum + Number(child.points || 0),
    0
  );

  const topChild = [...children].sort(
    (a, b) => Number(b.points || 0) - Number(a.points || 0)
  )[0];

  return (
    <RequireRole allowedRole="parent">
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Your Children 👦
              </h1>

              <p className={`mt-2 ${theme.mutedText}`}>
                View and manage children in your family rewards platform.
              </p>
            </div>

            <Link
              href="/create-child"
              className={`w-fit rounded-2xl px-5 py-3 font-black shadow-sm transition ${theme.button}`}
            >
              ＋ Add Child
            </Link>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="👦" label="Children" value={children.length} />
            <StatCard icon="⭐" label="Total Points" value={totalPoints} />
            <StatCard
              icon="👑"
              label="Top Score"
              value={Number(topChild?.points || 0)}
              orange
            />
          </div>

          {topChild && (
            <div
              className={`mb-8 rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${theme.iconBg} text-5xl`}
                  >
                    👑
                  </div>

                  <div>
                    <p className={`text-sm font-bold ${theme.mutedText}`}>
                      Top Child
                    </p>

                    <h2 className="text-3xl font-black">
                      {topChild.name}
                    </h2>

                    <p className={`mt-1 text-xl font-black ${theme.primaryText}`}>
                      ⭐ {Number(topChild.points || 0)} Points
                    </p>
                  </div>
                </div>

                <div className="w-full md:max-w-sm">
                  <div className={`mb-2 flex justify-between text-sm font-bold ${theme.mutedText}`}>
                    <span>Progress</span>
                    <span>{Number(topChild.points || 0)} pts</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${theme.progress}`}
                      style={{
                        width: `${Math.min(Number(topChild.points || 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 ${theme.mutedText} shadow-sm`}
            >
              Loading children...
            </div>
          )}

          {!loading && children.length === 0 && (
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-8 text-center shadow-sm`}
            >
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-3xl`}
              >
                👦
              </div>

              <h2 className="text-2xl font-black">
                No children added yet
              </h2>

              <p className={`mt-2 ${theme.mutedText}`}>
                Add your first child to start tracking points and rewards.
              </p>

              <Link
                href="/create-child"
                className={`mt-6 inline-block rounded-2xl px-5 py-3 font-black ${theme.button}`}
              >
                Add Child
              </Link>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {children.map((child) => {
              const points = Number(child.points || 0);
              const progress = Math.min(points, 100);

              return (
                <div
                  key={child.id}
                  className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm transition hover:-translate-y-1 ${theme.hoverBorder} hover:shadow-md`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-4xl`}
                    >
                      🧒
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${theme.warningBg} ${theme.warningText}`}
                    >
                      🔥 Streak
                    </div>
                  </div>

                  <h2 className="text-2xl font-black">
                    {child.name}
                  </h2>

                  <p className={`mt-1 text-sm ${theme.mutedText}`}>
                    Family rewards member
                  </p>

                  <div className={`mt-5 rounded-2xl ${theme.softBg} p-4`}>
                    <p className={`text-sm font-bold ${theme.mutedText}`}>
                      Current Points
                    </p>

                    <p className={`mt-1 text-3xl font-black ${theme.primaryText}`}>
                      ⭐ {points}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div
                      className={`mb-2 flex items-center justify-between text-xs font-bold ${theme.mutedText}`}
                    >
                      <span>Progress</span>
                      <span>{points} pts</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${theme.progress}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className={`rounded-2xl ${theme.softBg} p-3 text-center`}>
                      <p className="text-lg font-black">0</p>
                      <p className={`text-xs font-bold ${theme.mutedText}`}>
                        Tasks
                      </p>
                    </div>

                    <div className={`rounded-2xl ${theme.softBg} p-3 text-center`}>
                      <p className="text-lg font-black">0</p>
                      <p className={`text-xs font-bold ${theme.mutedText}`}>
                        Rewards
                      </p>
                    </div>
                  </div>

                  <button
                    className={`mt-5 w-full rounded-2xl border-2 ${theme.primaryBorder} px-4 py-3 font-black ${theme.primaryText} transition hover:bg-gray-100`}
                  >
                    View Profile →
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
    </RequireRole>
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