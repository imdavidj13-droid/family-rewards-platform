import Navbar from "@/components/Navbar";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-black text-red-600">
            Everything you need
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-900 md:text-6xl">
            Built for modern families.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Family Rewards helps parents encourage positive habits through
            tasks, points, rewards and achievements.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="📋"
            title="Task Management"
            description="Create chores, routines and goals that children can complete to earn points."
          />

          <FeatureCard
            icon="⭐"
            title="Points System"
            description="Award points automatically when tasks are completed and approved."
          />

          <FeatureCard
            icon="🎁"
            title="Rewards Shop"
            description="Build a custom rewards catalogue that children can spend their points on."
          />

          <FeatureCard
            icon="👦"
            title="Child Accounts"
            description="Give every child their own portal with points, rewards and progress."
          />

          <FeatureCard
            icon="🏆"
            title="Achievements"
            description="Celebrate milestones, streaks and positive habits with achievements."
          />

          <FeatureCard
            icon="📈"
            title="Reports"
            description="Track progress and understand how children are improving over time."
          />
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-4xl font-black">
              Keep children motivated.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Children complete tasks, earn points and work towards rewards.
              Parents stay in control by approving rewards and tracking progress.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit text="Create unlimited tasks" />
              <Benefit text="Custom rewards and point values" />
              <Benefit text="Realtime updates across devices" />
              <Benefit text="Safe parent approval system" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat icon="⭐" label="Points" value="248" />
              <MiniStat icon="📋" label="Tasks" value="18" />
              <MiniStat icon="🎁" label="Rewards" value="6" />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between">
                <span className="font-black">Jenson</span>
                <span className="font-black text-red-600">125 pts</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-3/4 rounded-full bg-red-600" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Activity text="Bedroom cleaned" points="+10" />
              <Activity text="Homework completed" points="+15" />
              <Activity text="Reward request pending" points="Pending" />
            </div>
          </div>
        </div>

        <div className="mt-24 rounded-3xl bg-blue-600 p-10 text-center text-white">
          <h2 className="text-4xl font-black">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join families already using Family Rewards to build better habits
            and make everyday tasks more rewarding.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-black text-blue-600"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-4xl">{icon}</div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-3 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-green-600">✓</span>
      <span className="font-medium">{text}</span>
    </div>
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-xs font-bold text-slate-500">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function Activity({
  text,
  points,
}: {
  text: string;
  points: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <span>{text}</span>
      <span className="font-black text-red-600">{points}</span>
    </div>
  );
}