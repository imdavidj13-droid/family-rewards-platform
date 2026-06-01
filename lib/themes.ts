const themes = {
  classic: {
    background: "bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950",
    pageText: "text-white",

    statChildren: "border-blue-400/30 bg-blue-500/15",
    statTasks: "border-red-400/30 bg-red-500/15",
    statRewards: "border-yellow-400/30 bg-yellow-500/15",
    statPending: "border-orange-400/30 bg-orange-500/15",

    championCard: "border-yellow-400/30 bg-yellow-400/10",
    activityCard: "border-white/10 bg-white/10",
    navCard: "border-white/10 bg-white/10 hover:bg-white/15",
  },

  trophyGold: {
    background: "bg-gradient-to-br from-black via-yellow-950 to-slate-950",
    pageText: "text-white",

    statChildren: "border-yellow-400/30 bg-yellow-500/15",
    statTasks: "border-red-400/30 bg-red-500/15",
    statRewards: "border-amber-300/40 bg-amber-500/20",
    statPending: "border-orange-400/30 bg-orange-500/15",

    championCard: "border-amber-300/50 bg-amber-400/15",
    activityCard: "border-yellow-400/20 bg-yellow-500/10",
    navCard: "border-yellow-400/20 bg-yellow-500/10 hover:bg-yellow-500/15",
  },

  electricBlue: {
    background: "bg-gradient-to-br from-blue-950 via-cyan-900 to-black",
    pageText: "text-white",

    statChildren: "border-cyan-400/30 bg-cyan-500/15",
    statTasks: "border-blue-400/30 bg-blue-500/15",
    statRewards: "border-sky-400/30 bg-sky-500/15",
    statPending: "border-white/20 bg-white/10",

    championCard: "border-cyan-400/40 bg-cyan-500/10",
    activityCard: "border-cyan-400/20 bg-cyan-500/10",
    navCard: "border-cyan-400/20 bg-cyan-500/10 hover:bg-cyan-500/15",
  },

  fire: {
    background: "bg-gradient-to-br from-red-950 via-orange-950 to-black",
    pageText: "text-white",

    statChildren: "border-red-400/30 bg-red-500/15",
    statTasks: "border-orange-400/30 bg-orange-500/15",
    statRewards: "border-yellow-400/30 bg-yellow-500/15",
    statPending: "border-red-500/30 bg-red-600/15",

    championCard: "border-yellow-400/40 bg-yellow-500/10",
    activityCard: "border-orange-400/20 bg-orange-500/10",
    navCard: "border-orange-400/20 bg-orange-500/10 hover:bg-orange-500/15",
  },

  football: {
    background: "bg-gradient-to-br from-green-950 via-green-900 to-black",
    pageText: "text-white",

    statChildren: "border-green-400/30 bg-green-500/15",
    statTasks: "border-lime-400/30 bg-lime-500/15",
    statRewards: "border-yellow-400/30 bg-yellow-500/15",
    statPending: "border-white/20 bg-white/10",

    championCard: "border-yellow-400/40 bg-yellow-500/10",
    activityCard: "border-green-400/20 bg-green-500/10",
    navCard: "border-green-400/20 bg-green-500/10 hover:bg-green-500/15",
  },
};

export { themes };
export type ThemeName = keyof typeof themes;