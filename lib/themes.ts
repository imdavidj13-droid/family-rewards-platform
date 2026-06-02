const themes = {
  classicRed: {
    name: "Classic Red",

    pageBg: "bg-[#F9FAFB]",
    sidebarBg: "bg-white",
    cardBg: "bg-white",
    softBg: "bg-gray-50",
    iconBg: "bg-gray-100",
    border: "border-gray-200",

    text: "text-gray-900",
    mutedText: "text-gray-500",

    primaryBg: "bg-red-600",
    primaryHover: "hover:bg-red-700",
    primaryText: "text-red-600",
    primaryBorder: "border-red-600",
    softAccentBg: "bg-gray-100",

    successBg: "bg-green-100",
    successText: "text-green-700",

    warningBg: "bg-orange-100",
    warningText: "text-orange-700",

    button: "bg-red-600 hover:bg-red-700 text-white",
    outlineButton:
      "border-2 border-red-600 bg-white text-red-600 hover:bg-gray-100",

    progress: "bg-red-600",
    focusBorder: "focus:border-red-600",
    hoverBorder: "hover:border-red-200",
  },

  oceanBlue: {
    name: "Ocean Blue",

    pageBg: "bg-[#F8FAFC]",
    sidebarBg: "bg-white",
    cardBg: "bg-white",
    softBg: "bg-gray-50",
    iconBg: "bg-gray-100",
    border: "border-gray-200",

    text: "text-gray-900",
    mutedText: "text-gray-500",

    primaryBg: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryText: "text-blue-600",
    primaryBorder: "border-blue-600",
    softAccentBg: "bg-gray-100",

    successBg: "bg-green-100",
    successText: "text-green-700",

    warningBg: "bg-orange-100",
    warningText: "text-orange-700",

    button: "bg-blue-600 hover:bg-blue-700 text-white",
    outlineButton:
      "border-2 border-blue-600 bg-white text-blue-600 hover:bg-gray-100",

    progress: "bg-blue-600",
    focusBorder: "focus:border-blue-600",
    hoverBorder: "hover:border-blue-200",
  },

  trophyGold: {
    name: "Trophy Gold",

    pageBg: "bg-[#FAFAF9]",
    sidebarBg: "bg-white",
    cardBg: "bg-white",
    softBg: "bg-stone-50",
    iconBg: "bg-stone-100",
    border: "border-stone-200",

    text: "text-stone-900",
    mutedText: "text-stone-500",

    primaryBg: "bg-amber-600",
    primaryHover: "hover:bg-amber-700",
    primaryText: "text-amber-700",
    primaryBorder: "border-amber-600",
    softAccentBg: "bg-stone-100",

    successBg: "bg-green-100",
    successText: "text-green-700",

    warningBg: "bg-orange-100",
    warningText: "text-orange-700",

    button: "bg-amber-600 hover:bg-amber-700 text-white",
    outlineButton:
      "border-2 border-amber-600 bg-white text-amber-700 hover:bg-stone-100",

    progress: "bg-amber-600",
    focusBorder: "focus:border-amber-600",
    hoverBorder: "hover:border-amber-200",
  },

  forestGreen: {
    name: "Forest Green",

    pageBg: "bg-[#F8FAF9]",
    sidebarBg: "bg-white",
    cardBg: "bg-white",
    softBg: "bg-gray-50",
    iconBg: "bg-gray-100",
    border: "border-gray-200",

    text: "text-gray-900",
    mutedText: "text-gray-500",

    primaryBg: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    primaryText: "text-emerald-600",
    primaryBorder: "border-emerald-600",
    softAccentBg: "bg-gray-100",

    successBg: "bg-green-100",
    successText: "text-green-700",

    warningBg: "bg-orange-100",
    warningText: "text-orange-700",

    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    outlineButton:
      "border-2 border-emerald-600 bg-white text-emerald-600 hover:bg-gray-100",

    progress: "bg-emerald-600",
    focusBorder: "focus:border-emerald-600",
    hoverBorder: "hover:border-emerald-200",
  },

  darkMode: {
    name: "Dark Mode",

    pageBg: "bg-slate-950",
    sidebarBg: "bg-slate-900",
    cardBg: "bg-slate-900",
    softBg: "bg-slate-800",
    iconBg: "bg-slate-800",
    border: "border-slate-700",

    text: "text-white",
    mutedText: "text-slate-400",

    primaryBg: "bg-red-600",
    primaryHover: "hover:bg-red-700",
    primaryText: "text-red-400",
    primaryBorder: "border-red-500",
    softAccentBg: "bg-slate-800",

    successBg: "bg-green-900/40",
    successText: "text-green-300",

    warningBg: "bg-orange-900/40",
    warningText: "text-orange-300",

    button: "bg-red-600 hover:bg-red-700 text-white",
    outlineButton:
      "border-2 border-red-500 bg-transparent text-red-400 hover:bg-slate-800",

    progress: "bg-red-500",
    focusBorder: "focus:border-red-500",
    hoverBorder: "hover:border-red-500",
  },
};

export { themes };
export type ThemeName = keyof typeof themes;