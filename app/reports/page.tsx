import Sidebar from "@/components/Sidebar";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">
              Reports 📈
            </h1>

            <p className="mt-2 text-gray-500">
              Track family progress, rewards and activity over time.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <StatCard icon="⭐" label="Points Earned" value="1,250" />
            <StatCard icon="📋" label="Tasks Completed" value="84" />
            <StatCard icon="🎁" label="Rewards Claimed" value="12" />
            <StatCard icon="🏆" label="Achievements" value="7" orange />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Top Child
              </h2>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  👦
                </div>

                <div>
                  <p className="text-2xl font-black">Jenson</p>
                  <p className="text-gray-500">⭐ 119 Points</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Most Popular Reward
              </h2>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  🎮
                </div>

                <div>
                  <p className="text-2xl font-black">Xbox Time</p>
                  <p className="text-gray-500">5 redemptions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900">
              Monthly Activity
            </h2>

            <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-gray-50">
              <p className="font-bold text-gray-400">
                Charts coming soon 📊
              </p>
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
  value: string;
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