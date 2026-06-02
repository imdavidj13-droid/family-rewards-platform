"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";

export default function CreateFamilyPage() {
  const { theme } = useTheme();
  const [familyName, setFamilyName] = useState("");
  const [message, setMessage] = useState("");

  async function createFamily() {
    const { error } = await supabase.from("families").insert({
      name: familyName,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setFamilyName("");
    setMessage("Family created successfully!");
  }

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text} px-6 py-20`}>
      <div
  className={`mx-auto max-w-xl rounded-3xl border ${theme.border} ${theme.cardBg} p-8 shadow-sm`}
>
        <h1 className="mb-4 text-3xl font-black">Create Your Family</h1>

        <input
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Smith Family"
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none"
        />

        <button
          onClick={createFamily}
          className="w-full rounded-xl bg-blue-600 p-4 font-bold hover:bg-blue-500"
        >
          Create Family
        </button>

        {message && <p className="mt-4 text-blue-200">{message}</p>}
      </div>
    </main>
  );
}