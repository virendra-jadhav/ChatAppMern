import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-app-mern-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-app-mern-theme", theme);
    set({ theme });
  },
}));
