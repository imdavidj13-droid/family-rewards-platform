"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-black">
          Family Rewards Dashboard
        </h1>

        <p className="mb-10 text-slate-400">
          Manage children, tasks, rewards and approvals.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/children"
            className="rounded-3xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">👦</div>
            <h2 className="text-2xl font-bold">Children</h2>
            <p className="mt-2 text-slate-400">
              View and manage children.
            </p>
          </Link>

          <Link
            href="/tasks"
            className="rounded-3xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-bold">Tasks</h2>
            <p className="mt-2 text-slate-400">
              Create and approve tasks.
            </p>
          </Link>

          <Link
            href="/rewards"
            className="rounded-3xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">🎁</div>
            <h2 className="text-2xl font-bold">Rewards</h2>
            <p className="mt-2 text-slate-400">
              Create and manage rewards.
            </p>
          </Link>

          <Link
            href="/redemptions"
            className="rounded-3xl bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-2xl font-bold">Approvals</h2>
            <p className="mt-2 text-slate-400">
              Review reward requests.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}