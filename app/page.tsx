import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_480px]">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm">
                🏆 Family Rewards Platform
              </div>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                Turn chores into rewards.
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-medium text-gray-500 md:text-xl">
                Create tasks, award points, approve rewards and help children
                build better habits with a simple family rewards system.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-red-600 px-8 py-4 text-center font-black text-white shadow-sm transition hover:bg-red-700"
                >
                  Open Dashboard
                </Link>

                <Link
                  href="/rewards"
                  className="rounded-2xl border-2 border-red-600 bg-white px-8 py-4 text-center font-black text-red-600 transition hover:bg-gray-100"
                >
                  View Rewards
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">
                    Family Dashboard
                  </p>
                  <h2 className="text-2xl font-black">Today</h2>
                </div>

                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-red-600">
                  Live Preview
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat icon="⭐" label="Points" value="248" />
                <MiniStat icon="📋" label="Tasks" value="18" />
                <MiniStat icon="🎁" label="Rewards" value="6" />
              </div>

              <div className="mt-5 rounded-3xl bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-black">Jenson</p>
                  <p className="text-sm font-black text-red-600">
                    125 pts
                  </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-3/4 rounded-full bg-red-600" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ActivityRow icon="✅" text="Bedroom cleaned" points="+10" />
                <ActivityRow icon="📋" text="Homework completed" points="+15" />
                <ActivityRow icon="🎁" text="Reward request pending" points="Pending" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-6 md:grid-cols-4">
            <FeatureCard
              icon="📋"
              title="Tasks"
              text="Create chores, routines and behaviour goals."
            />

            <FeatureCard
              icon="⭐"
              title="Points"
              text="Award points when children complete tasks."
            />

            <FeatureCard
              icon="🎁"
              title="Rewards"
              text="Build a reward shop children can request from."
            />

            <FeatureCard
              icon="🏆"
              title="Achievements"
              text="Celebrate milestones, streaks and progress."
            />
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black">
                How it works
              </h2>

              <p className="mt-3 text-gray-500">
                A simple system for parents and children.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <StepCard
                number="1"
                title="Create tasks"
                text="Add daily jobs, routines and goals for each child."
              />

              <StepCard
                number="2"
                title="Earn points"
                text="Children complete tasks and build up their points."
              />

              <StepCard
                number="3"
                title="Claim rewards"
                text="Children request rewards and parents approve them."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="mb-2 text-2xl">{icon}</div>
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function ActivityRow({
  icon,
  text,
  points,
}: {
  icon: string;
  text: string;
  points: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-bold">{text}</span>
      </div>

      <span className="text-sm font-black text-red-600">
        {points}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
        {icon}
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-2 text-gray-500">{text}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-black text-white">
        {number}
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-2 text-gray-500">{text}</p>
    </div>
  );
}