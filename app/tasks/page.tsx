"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";

type Child = {
  id: string;
  name: string;
  points: number;
};

type Task = {
  id: string;
  title: string;
  points: number;
  child_id: string;
  completed: boolean;
};

export default function TasksPage() {
  const { theme } = useTheme();
  const [children, setChildren] = useState<Child[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");
  const [childId, setChildId] = useState("");

  useEffect(() => {
    fetchChildren();
    fetchTasks();
  }, []);

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("id, name, points")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setChildren(data || []);
  }

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, points, child_id, completed")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setTasks(data || []);
  }

  async function createTask() {
    if (!title || !points || !childId) {
      alert("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title,
      points: Number(points),
      child_id: childId,
      completed: false,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setPoints("");
    setChildId("");
    fetchTasks();
  }

  async function approveTask(task: Task) {
    alert("Approve button clicked");

    const child = children.find((c) => c.id === task.child_id);

    if (!child) {
      alert("Child not found");
      return;
    }

    const currentPoints = Number(child.points || 0);
    const taskPoints = Number(task.points || 0);
    const newPoints = currentPoints + taskPoints;

    const { error: childError } = await supabase
      .from("children")
      .update({ points: newPoints })
      .eq("id", task.child_id);

    if (childError) {
      alert("Child points error: " + childError.message);
      return;
    }

    const { error: taskError } = await supabase
      .from("tasks")
      .update({ completed: true })
      .eq("id", task.id);

    if (taskError) {
      alert("Task completed error: " + taskError.message);
      return;
    }

    alert("Task approved and points added!");

    fetchChildren();
    fetchTasks();
  }

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text} p-6`}>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Tasks</h1>

        <div className={`mb-8 rounded-2xl border ${theme.border} ${theme.cardBg} p-5 shadow-sm`}>
          <h2 className="mb-4 text-xl font-semibold">Create task</h2>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name e.g. Brush teeth"
              className="w-full rounded-xl bg-slate-800 p-3 outline-none"
            />

            <input
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Points e.g. 10"
              type="number"
              className="w-full rounded-xl bg-slate-800 p-3 outline-none"
            />

            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full rounded-xl bg-slate-800 p-3 outline-none"
            >
              <option value="">Choose child</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>

            <button
              onClick={createTask}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
            >
              Add task
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const child = children.find((c) => c.id === task.child_id);

            return (
              <div
  key={task.id}
  className={`rounded-2xl border ${theme.border} ${theme.cardBg} p-4 shadow-sm`}
>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">{task.title}</p>
                    <p className="text-sm text-slate-400">
                      {child?.name || "Unknown child"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-300">
                      {task.points} pts
                    </span>

                    <button
                      type="button"
                      onClick={() => approveTask(task)}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                    >
                      {task.completed === true ? "Completed" : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <p className={theme.mutedText}>No tasks yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}