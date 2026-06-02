"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import { useRealtime } from "@/hooks/useRealtime";
import RequireRole from "@/components/RequireRole";


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
  useRealtime("tasks", fetchTasks);
useRealtime("children", fetchChildren);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");
  const [childId, setChildId] = useState("");
  const [toast, setToast] = useState<{
  type: "success" | "error" | "info";
  message: string;
} | null>(null);

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
      setToast({
  type: "error",
  message: error.message,
});
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
      setToast({
  type: "error",
  message: error.message,
});
      return;
    }

    setTasks(data || []);
  }

  async function createTask() {
    if (!title || !points || !childId) {
      setToast({
  type: "error",
  message: "Please fill in all fields",
});
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title,
      points: Number(points),
      child_id: childId,
      completed: false,
    });

    if (error) {
      setToast({
  type: "error",
  message: error.message,
});
      return;
    }

    setTitle("");
    setPoints("");
    setChildId("");
    fetchTasks();
  }

  async function approveTask(task: Task) {
    const child = children.find((c) => c.id === task.child_id);

    if (!child) {
      setToast({
  type: "error",
  message: "Child not found",
});
      return;
    }

    if (task.completed) {
      setToast({
  type: "error",
  message: "This task is already completed",
});
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
      setToast({
  type: "error",
  message: "Child points error: " + childError.message,
});
      return;
    }

    const { error: taskError } = await supabase
      .from("tasks")
      .update({ completed: true })
      .eq("id", task.id);

    if (taskError) {
      setToast({
  type: "error",
  message: "Task completed error: " + taskError.message,
});
      return;
    }

    fetchChildren();
    fetchTasks();
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  return (
     <RequireRole allowedRole="parent">
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          {toast && (
  <Toast
    type={toast.type}
    message={toast.message}
    onClose={() => setToast(null)}
  />
)}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                Tasks 📋
              </h1>

              <p className={`mt-2 ${theme.mutedText}`}>
                Create tasks, assign them to children and award points.
              </p>
            </div>

            <div
              className={`rounded-xl border ${theme.border} ${theme.cardBg} px-4 py-2 text-sm font-bold ${theme.mutedText} shadow-sm`}
            >
              {tasks.length} Tasks
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard icon="📋" label="Total Tasks" value={tasks.length} />
            <StatCard icon="✅" label="Completed" value={completedTasks} />
            <StatCard icon="⏳" label="Pending" value={pendingTasks} orange />
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="text-xl font-black">Create Task</h2>

              <p className={`mt-1 text-sm ${theme.mutedText}`}>
                Add a task and choose who it belongs to.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={`mb-2 block text-sm font-bold ${theme.mutedText}`}>
                    Task name
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Brush teeth"
                    className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none transition placeholder:text-gray-400 ${theme.focusBorder}`}
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-bold ${theme.mutedText}`}>
                    Points
                  </label>

                  <input
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    placeholder="e.g. 10"
                    type="number"
                    className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none transition placeholder:text-gray-400 ${theme.focusBorder}`}
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-bold ${theme.mutedText}`}>
                    Child
                  </label>

                  <select
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                    className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none transition ${theme.focusBorder}`}
                  >
                    <option value="">Choose child</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={createTask}
                  className={`w-full rounded-2xl px-5 py-4 font-black transition ${theme.button}`}
                >
                  ＋ Add Task
                </button>
              </div>
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="text-xl font-black">Task Overview</h2>

              <p className={`mt-1 text-sm ${theme.mutedText}`}>
                Quickly see what still needs doing.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <MiniCard icon="✅" label="Completed" value={completedTasks} />
                <MiniCard icon="⏳" label="Waiting" value={pendingTasks} />
              </div>

              <div className={`mt-6 rounded-2xl ${theme.softBg} p-5`}>
                <p className={`text-sm font-bold ${theme.mutedText}`}>
                  Completion Rate
                </p>

                <p className={`mt-2 text-3xl font-black ${theme.primaryText}`}>
                  {tasks.length === 0
                    ? 0
                    : Math.round((completedTasks / tasks.length) * 100)}
                  %
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${theme.progress}`}
                    style={{
                      width: `${
                        tasks.length === 0
                          ? 0
                          : Math.round((completedTasks / tasks.length) * 100)
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">All Tasks</h2>
          </div>

          {tasks.length === 0 && (
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-8 text-center shadow-sm`}
            >
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-3xl`}
              >
                📋
              </div>

              <h2 className="text-2xl font-black">No tasks yet</h2>

              <p className={`mt-2 ${theme.mutedText}`}>
                Create your first task to start awarding points.
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => {
              const child = children.find((c) => c.id === task.child_id);

              return (
                <div
                  key={task.id}
                  className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm transition hover:-translate-y-1 ${theme.hoverBorder} hover:shadow-md`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${theme.iconBg} text-4xl`}
                    >
                      📋
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        task.completed
                          ? `${theme.successBg} ${theme.successText}`
                          : `${theme.warningBg} ${theme.warningText}`
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black">
                    {task.title}
                  </h2>

                  <p className={`mt-1 text-sm ${theme.mutedText}`}>
                    Assigned to {child?.name || "Unknown child"}
                  </p>

                  <div className={`mt-5 rounded-2xl ${theme.softBg} p-4`}>
                    <p className={`text-sm font-bold ${theme.mutedText}`}>
                      Points
                    </p>

                    <p className={`mt-1 text-3xl font-black ${theme.primaryText}`}>
                      ⭐ {Number(task.points || 0)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => approveTask(task)}
                    disabled={task.completed}
                    className={`mt-5 w-full rounded-2xl px-4 py-3 font-black transition ${
                      task.completed
                        ? "cursor-not-allowed bg-gray-200 text-gray-500"
                        : theme.button
                    }`}
                  >
                    {task.completed ? "Completed" : "Approve Task"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
            </div>
    </main>
  </RequireRole>
  );
}

function StatCard({
  icon,
  label,
  value,
  orange = false,
}: {
  icon: string;
  label: string;
  value: number;
  orange?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-5 shadow-sm`}
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${
          orange ? theme.warningBg : theme.iconBg
        }`}
      >
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>

      <h2 className="mt-2 text-3xl font-black">{value}</h2>
    </div>
  );
}

function MiniCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4`}>
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}
      >
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}