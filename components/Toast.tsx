import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

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
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon =
    type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  return (
    <div
      className={`fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border ${theme.border} ${theme.cardBg} px-5 py-4 shadow-xl`}
    >
      <div className="text-2xl">{icon}</div>

      <p className={`text-sm font-bold ${theme.text}`}>
        {message}
      </p>
    </div>
  );
}