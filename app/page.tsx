export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-6 inline-block rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
            🚀 Family Rewards Platform
          </div>

          <h1 className="mb-6 text-5xl font-black tracking-tight md:text-7xl">
            Turn Chores Into Rewards
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 md:text-xl">
            Help children build positive habits, earn points, unlock rewards,
            and stay motivated every day.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-blue-600 px-8 py-4 font-bold transition hover:bg-blue-500">
              Get Started
            </button>

            <button className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 text-4xl">⭐</div>
            <h2 className="mb-2 text-xl font-bold">Earn Points</h2>
            <p className="text-white/70">
              Complete chores and good deeds to earn points.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 text-4xl">🎁</div>
            <h2 className="mb-2 text-xl font-bold">Claim Rewards</h2>
            <p className="text-white/70">
              Exchange points for rewards approved by parents.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 text-4xl">👨‍👩‍👧‍👦</div>
            <h2 className="mb-2 text-xl font-bold">Family Dashboard</h2>
            <p className="text-white/70">
              Track progress, manage rewards and celebrate achievements.
            </p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-24 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-center text-3xl font-black">
            Dashboard Preview
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-black/30 p-6">
              <h3 className="mb-4 text-xl font-bold">👦 Child Account</h3>

              <div className="mb-3 rounded-xl bg-blue-600 p-4">
                <div className="text-sm opacity-80">Available Points</div>
                <div className="text-3xl font-black">125 ⭐</div>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                🎁 Movie Night Reward - 100 Points
              </div>
            </div>

            <div className="rounded-2xl bg-black/30 p-6">
              <h3 className="mb-4 text-xl font-bold">👩 Parent Dashboard</h3>

              <div className="space-y-3">
                <div className="rounded-xl bg-white/10 p-4">
                  ✅ Bedroom cleaned (+10)
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  ✅ Homework completed (+15)
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  🎁 Reward request pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}