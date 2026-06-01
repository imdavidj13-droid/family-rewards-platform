"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themes } from "@/lib/themes";

type ThemeName = keyof typeof themes;

type ThemeContextType = {
  theme: (typeof themes)[ThemeName];
  selectedTheme: ThemeName;
  changeTheme: (themeName: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedTheme, setSelectedTheme] =
    useState<ThemeName>("trophyGold");

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "family-theme"
    ) as ThemeName | null;

    if (savedTheme && themes[savedTheme]) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  function changeTheme(themeName: ThemeName) {
    setSelectedTheme(themeName);
    localStorage.setItem("family-theme", themeName);
  }

  const theme = themes[selectedTheme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        selectedTheme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}