import { create } from "zustand";

export interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "info";
}

interface TerminalState {
  history: TerminalLine[];
  theme: "green" | "amber";
  isMuted: boolean;
  coins: string[]; // List of collected coins (Easter eggs)
  activeWindows: string[]; // e.g. ["terminal", "arcade", "projects"]
  addHistoryLine: (line: TerminalLine) => void;
  clearHistory: () => void;
  setTheme: (theme: "green" | "amber") => void;
  toggleMute: () => void;
  collectCoin: (coinId: string) => boolean; // returns true if newly collected
  openWindow: (windowId: string) => void;
  closeWindow: (windowId: string) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  history: [
    { text: "MOHIT.EXE [Version 2.0.198X]", type: "info" },
    { text: "(c) 198X Mohit Kishore Corporation. All rights reserved.", type: "info" },
    { text: "System memory: 640KB RAM. All neural sectors optimal.", type: "info" },
    { text: "Type 'help' or 'about' to get started.", type: "info" },
  ],
  theme: "green",
  isMuted: false,
  coins: [],
  activeWindows: ["terminal"], // start with terminal open

  addHistoryLine: (line) =>
    set((state) => ({ history: [...state.history, line] })),

  clearHistory: () => set({ history: [] }),

  setTheme: (theme) => set({ theme }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  collectCoin: (coinId) => {
    const { coins } = get();
    if (coins.includes(coinId)) return false;
    set({ coins: [...coins, coinId] });
    return true;
  },

  openWindow: (windowId) =>
    set((state) => {
      if (state.activeWindows.includes(windowId)) return state;
      return { activeWindows: [...state.activeWindows, windowId] };
    }),

  closeWindow: (windowId) =>
    set((state) => ({
      activeWindows: state.activeWindows.filter((w) => w !== windowId),
    })),
}));
