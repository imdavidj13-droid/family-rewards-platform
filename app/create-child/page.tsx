"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateChildPage() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");

  async function createChild() {
    const { error } = await supabase.from("children").insert({
      name,
      points,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Child created successfully!");
    setName("");
    setPoints(0);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-3xl font-black">
          Add Child
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Child Name"
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 p-4"
        />

        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          placeholder="Starting Points"
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 p-4"
        />

        <button
          onClick={createChild}
          className="w-full rounded-xl bg-blue-600 p-4 font-bold hover:bg-blue-500"
        >
          Add Child
        </button>

        {message && (
          <p className="mt-4 text-blue-200">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}