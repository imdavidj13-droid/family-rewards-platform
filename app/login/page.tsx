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

  return (
  <main className="min-h-screen bg-slate-50">
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
      <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
        
        {/* Left Side */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
            🏆 Family Rewards Platform
          </div>

          <h1 className="text-5xl font-black leading-tight text-slate-900 md:text-6xl">
            Turn chores into rewards.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Create tasks, award points, approve rewards and help children
            build better habits with a simple family rewards system.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              ⭐ Points & Rewards
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              📋 Task Management
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              🏆 Achievements
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-3xl font-black text-slate-900">
              Welcome Back 👋
            </h2>

            <p className="mb-8 text-slate-500">
              Sign in to continue managing your family rewards.
            </p>

            <input
              className="mb-4 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-blue-500"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="mb-6 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-blue-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={login}
              className="w-full rounded-2xl bg-blue-600 p-4 font-black text-white transition hover:bg-blue-500"
            >
              Login
            </button>

            {message && (
              <p className="mt-4 text-center font-bold text-red-500">
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-bold text-blue-600 hover:text-blue-500"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
);}