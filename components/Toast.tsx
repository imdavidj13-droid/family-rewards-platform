import { useEffect } from "react";

type ToastType = "success" | "error" | "info";

export default function Toast({
  type,
  message,
  onClose,
}: {
  type: ToastType;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  const styles =
    type === "success"
      ? "border-green-500 bg-green-600 text-white"
      : type === "error"
      ? "border-red-500 bg-red-600 text-white"
      : "border-blue-500 bg-blue-600 text-white";

  return (
    <div
      className={`fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl ${styles}`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm font-black">{message}</p>
    </div>
  );
}