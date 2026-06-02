import Sidebar from "@/components/Sidebar";

const feedItems = [
  {
    icon: "⭐",
    title: "Jenson earned 10 points",
    description: "Completed Get ready for school.",
    time: "2 hours ago",
    type: "Points",
  },
  {
    icon: "🎁",
    title: "Jenson requested Xbox Time",
    description: "Waiting for parent approval.",
    time: "5 hours ago",
    type: "Request",
  },
  {
    icon: "✅",
    title: "Reward approved",
    description: "Xbox Time was approved.",
    time: "Yesterday",
    type: "Approved",
  },
  {
    icon: "🏆",
    title: "Achievement unlocked",
    description: "100 Points Club completed.",
    time: "Yesterday",
    type: "Achievement",
  },
];

export default function FamilyFeedPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">
              Family Feed 📰
            </h1>

            <p className="mt-2 text-gray-500">
              A simple timeline of points, rewards, approvals and achievements.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="📰" label="Updates" value={feedItems.length} />
            <StatCard icon="⭐" label="Point Events" value={1} />
            <StatCard icon="🏆" label="Milestones" value={1} orange />
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-black text-gray-900">
              Latest Activity
            </h2>

            <div className="space-y-4">
              {feedItems.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl bg-gray-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                      <div>
                        <h3 className="font-black text-gray-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-bold text-gray-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
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