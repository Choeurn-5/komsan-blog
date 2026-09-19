"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // On mount, read from local storage or system preference
    const savedTheme = localStorage.getItem("komsan-theme") as "light" | "dark" | null;
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
      document.documentElement.classList.remove(savedTheme === "light" ? "dark" : "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(prefersDark ? "dark" : "light");
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("komsan-theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    
    // Notify iframe parent of height change as styling might affect height
    if (typeof window !== "undefined" && window.parent) {
      setTimeout(() => {
        window.parent.postMessage({ type: "komsan-height", height: document.documentElement.scrollHeight }, "*");
      }, 100);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!theme) {
    return <div className="w-10 h-6"></div>; // Placeholder
  }

  return (
    <button
      onClick={toggleTheme}
      className="komsan-theme-toggle flex items-center justify-center w-10 h-10 rounded-full bg-[var(--brand-secondary)] hover:bg-[var(--brand-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      )}
    </button>
  );
}
