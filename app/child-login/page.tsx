"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("Login failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    if (profile?.role === "child") {
      window.location.href = "/child";
      return;
    }

    window.location.href = "/dashboard";
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        {icon}
      </div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
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

return (
  <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
    <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm">
          🏆 Family Rewards Platform
        </div>

        <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Turn chores into rewards.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Create tasks, award points, approve rewards and help children build
          better habits with a simple family rewards system.
        </p>

        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
          <FeatureCard icon="📋" title="Tasks" text="Create routines and goals." />
          <FeatureCard icon="⭐" title="Points" text="Reward positive habits." />
          <FeatureCard icon="🎁" title="Rewards" text="Approve requests easily." />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black text-slate-500">Live Preview</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MiniStat icon="⭐" label="Points" value="248" />
            <MiniStat icon="📋" label="Tasks" value="18" />
            <MiniStat icon="🎁" label="Rewards" value="6" />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex justify-between text-sm font-black">
              <span>Jenson</span>
              <span className="text-red-600">125 pts</span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-3/4 rounded-full bg-red-600" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
          <div className="mb-8">
            <p className="text-sm font-black text-red-600">Welcome back</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Child Login 👋
            </h2>
            <p className="mt-2 text-slate-500">
              Sign in to continue your family rewards journey.
            </p>
          </div>

          <input
            className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mb-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full rounded-2xl bg-blue-600 p-4 font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Login
          </button>

          {message && (
            <p className="mt-4 rounded-2xl bg-red-50 p-3 text-center font-bold text-red-600">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-black text-blue-600 hover:text-blue-500">
              Create Account
            </a>
          </p>
        </div>
      </section>
    </div>
  </main>
);

}