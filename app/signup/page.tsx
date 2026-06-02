"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          name,
          role: "parent",
        });

      if (profileError) {
        setMessage(profileError.message);
        return;
      }
    }

    setMessage("Account created successfully!");
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

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 font-black text-white">
        {number}
      </div>

      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
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
          Build better habits with rewards.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Set tasks, award points and let children work towards rewards in a
          simple platform built for families.
        </p>

        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
          <FeatureCard icon="📋" title="Create tasks" text="Set daily routines and goals." />
          <FeatureCard icon="⭐" title="Award points" text="Celebrate effort and progress." />
          <FeatureCard icon="🎁" title="Approve rewards" text="Children request, parents approve." />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-slate-500">How it works</p>

          <div className="mt-5 space-y-4">
            <Step number="1" title="Add your children" text="Create profiles and give every child their own points balance." />
            <Step number="2" title="Create tasks and rewards" text="Choose what earns points and what those points can be spent on." />
            <Step number="3" title="Approve requests" text="Children request rewards and parents stay in control." />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
          <div className="mb-8">
            <p className="text-sm font-black text-red-600">Start your family account</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Create Account 🚀
            </h2>
            <p className="mt-2 text-slate-500">
              Create a parent account first. Child accounts can be linked later.
            </p>
          </div>

          <input
            className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={signUp}
            className="w-full rounded-2xl bg-blue-600 p-4 font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Create Account
          </button>

          {message && (
            <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-center font-bold text-blue-600">
              {message}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="font-black">What happens next?</p>
            <p className="mt-1 text-sm text-slate-500">
              You&apos;ll be able to add children, create tasks and build your
              rewards shop straight away.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a href="/login" className="font-black text-blue-600 hover:text-blue-500">
              Login
            </a>
          </p>
        </div>
      </section>
    </div>
  </main>
);

}