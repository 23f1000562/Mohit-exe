import { create } from "zustand";

interface GameStats {
  highScore: number;
  gamesPlayed: number;
}

interface ArcadeState {
  activeGame: string | null; // "snake" | "minesweeper" | "tictactoe" | "rps" | "memory" | "2048" | "typing" | null
  stats: Record<string, GameStats>;
  unlockedAchievements: string[]; // list of condition identifiers (e.g. "snake_50", "konami_code")
  playerName: string;
  setPlayerName: (name: string) => void;
  playGame: (gameName: string | null) => void;
  submitScore: (gameName: string, score: number) => { isNewHighScore: boolean };
  unlockAchievement: (achievementCondition: string) => boolean; // returns true if newly unlocked
  incrementGamesPlayed: (gameName: string) => void;
}

export const useArcadeStore = create<ArcadeState>((set, get) => ({
  activeGame: null,
  playerName: "GUEST_USER",
  stats: {
    snake: { highScore: 0, gamesPlayed: 0 },
    minesweeper: { highScore: 999, gamesPlayed: 0 }, // minesweeper high score is fastest time, lower is better
    tictactoe: { highScore: 0, gamesPlayed: 0 },
    rps: { highScore: 0, gamesPlayed: 0 },
    memory: { highScore: 0, gamesPlayed: 0 },
    "2048": { highScore: 0, gamesPlayed: 0 },
    typing: { highScore: 0, gamesPlayed: 0 },
  },
  unlockedAchievements: [],

  setPlayerName: (playerName) => set({ playerName: playerName.toUpperCase().slice(0, 12) }),

  playGame: (activeGame) => set({ activeGame }),

  submitScore: (gameName, score) => {
    const currentStats = get().stats[gameName] || { highScore: 0, gamesPlayed: 0 };
    let isNewHighScore = false;

    if (gameName === "minesweeper") {
      if (score > 0 && (currentStats.highScore === 0 || score < currentStats.highScore || currentStats.highScore === 999)) {
        isNewHighScore = true;
      }
    } else {
      if (score > currentStats.highScore) {
        isNewHighScore = true;
      }
    }

    if (isNewHighScore) {
      set((state) => ({
        stats: {
          ...state.stats,
          [gameName]: {
            ...currentStats,
            highScore: score,
          },
        },
      }));
    }

    return { isNewHighScore };
  },

  unlockAchievement: (achievementCondition) => {
    const { unlockedAchievements } = get();
    if (unlockedAchievements.includes(achievementCondition)) return false;
    set({ unlockedAchievements: [...unlockedAchievements, achievementCondition] });
    return true;
  },

  incrementGamesPlayed: (gameName) => {
    set((state) => {
      const currentStats = state.stats[gameName] || { highScore: 0, gamesPlayed: 0 };
      return {
        stats: {
          ...state.stats,
          [gameName]: {
            ...currentStats,
            gamesPlayed: currentStats.gamesPlayed + 1,
          },
        },
      };
    });
  },
}));
