import type { ReactNode } from "react";

const statCards = [
  {
    icon: "👥",
    title: "Total Children",
    value: "1,248",
    change: "↑ 8.5%",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Active This Week",
    value: "892",
    change: "↑ 12.4%",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: "✅",
    title: "Quests Completed",
    value: "4,562",
    change: "↑ 15.2%",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: "🎁",
    title: "Rewards Redeemed",
    value: "2,341",
    change: "↑ 10.7%",
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    icon: "🪙",
    title: "Total Gold Doubloons",
    value: "127,532",
    change: "↑ 9.3%",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
];

const sidebarGroups = [
  {
    title: "MANAGE",
    items: ["Children", "Families", "Quests", "Rewards", "Achievements", "Themes"],
  },
  {
    title: "COMMUNICATION",
    items: ["Support Requests", "Announcements"],
  },
  {
    title: "ANALYTICS",
    items: ["Reports", "Activity Log", "Exports"],
  },
  {
    title: "SETTINGS",
    items: ["Settings", "Integrations", "Billing"],
  },
];

const children = ["Liam J.", "Emma R.", "Noah K.", "Ava M.", "Oliver T."];

const quests = [
  "Make Your Bed",
  "Read for 20 Minutes",
  "Help Around the House",
  "Eat Your Veggies",
  "Take a Shower",
];

const achievements = [
  "🔥 7 Day Streak",
  "🛡️ First Quest",
  "⭐ 100 XP",
  "🎖️ Helping Hand",
  "🏅 30 Day Streak",
];

const support = [
  "Cannot redeem reward",
  "Quest not tracking",
  "How do streaks work?",
  "Payment question",
  "Bug: XP not adding",
];

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function ActivityGraph() {
  const purplePoints = [
    [20, 145],
    [130, 120],
    [240, 138],
    [350, 130],
    [460, 80],
    [570, 135],
    [680, 142],
  ];

  const bluePoints = [
    [20, 175],
    [130, 160],
    [240, 145],
    [350, 135],
    [460, 115],
    [570, 150],
    [680, 155],
  ];

  return (
    <div className="relative h-64 rounded-xl bg-[linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:100%_48px] p-6">
      <svg viewBox="0 0 700 220" className="h-full w-full">
        <polyline
          fill="none"
          stroke="#7c3aed"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={purplePoints.map(([x, y]) => `${x},${y}`).join(" ")}
        />

        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={bluePoints.map(([x, y]) => `${x},${y}`).join(" ")}
        />

        {purplePoints.map(([x, y], index) => (
          <circle key={`purple-${index}`} cx={x} cy={y} r="6" fill="#7c3aed" />
        ))}

        {bluePoints.map(([x, y], index) => (
          <circle key={`blue-${index}`} cx={x} cy={y} r="6" fill="#3b82f6" />
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
        <span>May 13</span>
        <span>May 14</span>
        <span>May 15</span>
        <span>May 16</span>
        <span>May 17</span>
        <span>May 18</span>
        <span>May 19</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex">
        <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-[#071426] p-5 text-white lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="text-4xl">🏴‍☠️</div>

            <div>
              <h1 className="text-sm font-black uppercase leading-tight">
                Family Rewards
              </h1>
              <p className="text-xs text-slate-300">ADMIN</p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-white/10 px-4 py-3 font-bold">
            ▦ Dashboard
          </div>

          <nav className="space-y-6 text-sm">
            {sidebarGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-bold text-slate-400">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl px-4 py-2 font-semibold text-slate-200 hover:bg-white/10"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-xl bg-white/10 px-4 py-3 text-sm font-bold">
            ◇ View Child Portal ↗
          </div>
        </aside>

        <section className="w-full p-5 lg:ml-64 lg:p-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950">
                Welcome back, Captain! 👋
              </h2>
              <p className="text-sm font-medium text-slate-600">
                Here&apos;s what&apos;s happening in Family Rewards today.
              </p>
            </div>

            <div className="hidden rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm lg:block">
              📅 May 13 – May 19, 2024
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <div
                  className={`mb-3 inline-flex size-11 items-center justify-center rounded-xl ${stat.bg} text-2xl`}
                >
                  {stat.icon}
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {stat.title}
                </p>

                <h3 className="mt-1 text-3xl font-black text-slate-950">
                  {stat.value}
                </h3>

                <p className="mt-2 text-sm font-bold text-green-600">
                  {stat.change}
                </p>

                <div
                  className={`mt-4 h-8 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${stat.color}`}
                />
              </Card>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-12">
            <Card className="xl:col-span-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-slate-950">
                  Activity Overview
                </h3>

                <button className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-600">
                  Last 7 days⌄
                </button>
              </div>

              <ActivityGraph />
            </Card>

            <Card className="xl:col-span-3">
              <h3 className="mb-4 font-black text-slate-950">
                Top Performing Quests
              </h3>

              <div className="space-y-4">
                {quests.map((quest, index) => (
                  <div
                    key={quest}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-500">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900">{quest}</span>
                    </div>

                    <span className="text-xs font-bold text-purple-600">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="xl:col-span-3">
              <h3 className="mb-5 font-black text-slate-950">
                User Engagement
              </h3>

              <div className="mx-auto flex size-44 items-center justify-center rounded-full border-[28px] border-blue-500">
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-950">1,248</p>
                  <p className="text-xs text-slate-500">Total Children</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
                <p>🟣 Daily Active — 35%</p>
                <p>🔵 Weekly Active — 37%</p>
                <p>🟢 Monthly Active — 18%</p>
              </div>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <h3 className="mb-4 font-black text-slate-950">New Children</h3>

              {children.map((child, index) => (
                <div
                  key={child}
                  className="flex items-center justify-between border-b py-3 text-sm last:border-0"
                >
                  <span className="font-bold text-slate-900">👦 {child}</span>
                  <span className="text-slate-500">
                    May {19 - index}, 2024
                  </span>
                </div>
              ))}
            </Card>

            <Card>
              <h3 className="mb-4 font-black text-slate-950">
                Gold Doubloons Economy
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Earned</p>
                  <p className="text-xl font-black text-slate-950">+32,456</p>
                </div>

                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Spent</p>
                  <p className="text-xl font-black text-slate-950">-18,924</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-yellow-50 p-4">
                <p className="text-xs text-slate-500">Total in Circulation</p>
                <p className="text-3xl font-black text-slate-950">127,532</p>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-black text-slate-950">
                Achievements Unlocked
              </h3>

              {achievements.map((achievement) => (
                <div
                  key={achievement}
                  className="border-b py-3 text-sm font-bold text-slate-900 last:border-0"
                >
                  {achievement}
                </div>
              ))}
            </Card>

            <Card>
              <h3 className="mb-4 font-black text-slate-950">
                Support Requests
              </h3>

              {support.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b py-3 text-sm last:border-0"
                >
                  <span className="font-bold text-slate-900">{item}</span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      index % 2 === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {index % 2 === 0 ? "High" : "Medium"}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Card>
              <h3 className="font-black text-slate-950">✅ System Health</h3>
              <p className="mt-3 text-lg font-bold text-green-600">
                All systems operational
              </p>
              <p className="text-sm text-slate-500">Uptime: 99.9%</p>
            </Card>

            <Card>
              <h3 className="mb-4 font-black text-slate-950">Quick Actions</h3>

              <div className="grid grid-cols-4 gap-3 text-center text-sm font-bold text-slate-800">
                <div>
                  📜
                  <br />
                  Create Quest
                </div>

                <div>
                  🎁
                  <br />
                  Add Reward
                </div>

                <div>
                  📣
                  <br />
                  Send Announcement
                </div>

                <div>
                  📄
                  <br />
                  Export Report
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}