"use client";

import React, { useState, useEffect } from "react";
import CRTContainer from "@/components/CRTContainer";
import { useArcadeStore } from "@/store/useArcadeStore";
import { soundHelper } from "@/lib/sounds";
import SnakeGame from "@/components/games/Snake";
import MinesweeperGame from "@/components/games/Minesweeper";
import TicTacToeGame from "@/components/games/TicTacToe";
import RockPaperScissorsGame from "@/components/games/RockPaperScissors";
import MemoryMatchGame from "@/components/games/MemoryMatch";
import Game2048 from "@/components/games/Game2048";
import TypingSpeedChallenge from "@/components/games/TypingSpeed";
import { Gamepad2, Trophy, Award, User, RefreshCw, Flame } from "lucide-react";

type GameId = "snake" | "minesweeper" | "tictactoe" | "rps" | "memory" | "2048" | "typing";

export default function ArcadePage() {
  const { playerName, setPlayerName, stats, unlockedAchievements, activeGame, playGame } = useArcadeStore();
  const [selectedGame, setSelectedGame] = useState<GameId>("snake");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const playClick = () => soundHelper?.playClick();
  const playSuccess = () => soundHelper?.playSuccess();

  const gamesList = [
    { id: "snake", name: "SNAKE.SYS", desc: "Classic pixel food collector.", icon: "🐍" },
    { id: "minesweeper", name: "MINE_SWEEP", desc: "Win 98 grid mine-sweeper.", icon: "💣" },
    { id: "tictactoe", name: "TIC_TAC_TOE", desc: "Player vs minimax unbeatable AI.", icon: "❌" },
    { id: "rps", name: "R_P_S", desc: "Hand shapes battle vs AI.", icon: "✊" },
    { id: "memory", name: "MEM_MATCH", desc: "Flip matching technology cards.", icon: "🧠" },
    { id: "2048", name: "2048_TILES", desc: "Slide numbers to technology blocks.", icon: "🧩" },
    { id: "typing", name: "TYPE_SPEED", desc: "Programming keywords speed test.", icon: "⌨️" },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGame]);

  const fetchLeaderboard = async () => {
    setLoadingLb(true);
    try {
      const res = await fetch(`/api/scores?gameName=${selectedGame}`);
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.scores || []);
      }
    } catch (_) {}
    setLoadingLb(false);
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      playSuccess();
    }
  };

  // Calculate stats summation
  const totalGamesPlayed = Object.values(stats).reduce((acc, curr) => acc + curr.gamesPlayed, 0);
  const totalHighScore = Object.entries(stats).reduce((acc, [game, stat]) => {
    if (game === "minesweeper") return acc; // Minesweeper is time-based, skip high score sum
    return acc + stat.highScore;
  }, 0);

  const renderActiveGame = () => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame />;
      case "minesweeper":
        return <MinesweeperGame />;
      case "tictactoe":
        return <TicTacToeGame />;
      case "rps":
        return <RockPaperScissorsGame />;
      case "memory":
        return <MemoryMatchGame />;
      case "2048":
        return <Game2048 />;
      case "typing":
        return <TypingSpeedChallenge />;
      default:
        return <SnakeGame />;
    }
  };

  return (
    <CRTContainer>
      <div className="mb-4 font-mono text-xs text-on-surface-variant opacity-70">
        [SYS] SECURE_CONNECTION: /ARCADE/CABINET_ROOM.DAT ... OK
      </div>

      {/* Profile Dashboard Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch select-none font-mono">
        {/* Profile Card */}
        <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow flex flex-col justify-between">
          <div className="border-b border-outline-variant/30 pb-2 mb-3">
            <span className="font-label text-[10px] text-on-surface-variant font-bold block mb-1">PLAYER_ID:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value.toUpperCase());
                  if (soundHelper) soundHelper.playKey();
                }}
                maxLength={12}
                className="bg-surface-container border border-outline-variant text-primary font-mono text-xs p-1 focus:outline-none focus:border-primary flex-grow"
              />
              <button
                onClick={handleNameSave}
                className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 cursor-pointer active:translate-y-[1px]"
              >
                SAVE
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="w-4 h-4 text-primary" />
            <span>ALIAS: {playerName}</span>
          </div>
        </div>

        {/* Arcade Stats */}
        <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow flex flex-col justify-center gap-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-secondary" /> GAMES_PLAYED:</span>
            <span className="text-secondary font-bold">{totalGamesPlayed}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-500" /> TOTAL_HIGH_SCORE:</span>
            <span className="text-yellow-500 font-bold">{totalHighScore} pts</span>
          </div>
        </div>

        {/* Unlocked Achievements */}
        <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow flex flex-col justify-center">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> ACHIEVEMENTS:</span>
            <span className="text-accent font-bold">{unlockedAchievements.length} UNLOCKED</span>
          </div>
          <div className="flex gap-1.5 mt-2 overflow-x-auto py-1">
            {unlockedAchievements.map((ach) => (
              <span key={ach} className="text-[8px] bg-accent/20 border border-accent/40 text-accent px-1 uppercase font-bold shrink-0">
                #{ach}
              </span>
            ))}
            {unlockedAchievements.length === 0 && (
              <span className="text-[9px] text-on-surface-variant opacity-50">NO_ACHIEVEMENTS_EARNED_YET</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Game cabinet list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border-4 border-outline-variant p-4 dither-shadow select-none">
            <h3 className="font-headline text-lg text-primary mb-4 uppercase crt-glow">ARCADE_CABINETS</h3>
            <div className="flex flex-col gap-2">
              {gamesList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGame(g.id as GameId);
                    playClick();
                  }}
                  className={`w-full text-left p-3 border-2 font-label text-xs flex items-center gap-3 active:translate-y-[2px] transition-all cursor-pointer ${
                    selectedGame === g.id
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className="font-bold">{g.name}</p>
                    <p className="text-[10px] opacity-75">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Selected cabinet viewport */}
        <div className="lg:col-span-5 bg-surface border-4 border-outline-variant p-4 dither-shadow">
          <div className="border-b-2 border-outline-variant pb-2 mb-4 flex justify-between items-center select-none">
            <span className="font-label text-xs text-primary font-bold uppercase">{selectedGame.toUpperCase()}.EXE</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-primary"></div>
              <div className="w-2.5 h-2.5 bg-outline-variant"></div>
            </div>
          </div>
          {renderActiveGame()}
        </div>

        {/* Right Side: Scoreboard Leaderboard */}
        <div className="lg:col-span-3 bg-surface border-4 border-outline-variant p-4 dither-shadow font-mono text-xs">
          <div className="flex justify-between items-center border-b-2 border-outline-variant pb-2 mb-4 select-none">
            <h3 className="font-headline text-xs text-secondary font-bold uppercase flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> SCOREBOARD
            </h3>
            <button onClick={fetchLeaderboard} className="p-1 border border-outline-variant hover:text-primary hover:border-primary active:translate-y-[1px] cursor-pointer">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {loadingLb ? (
            <p className="text-on-surface-variant opacity-60 text-[10px] animate-pulse">RECONSTRUCTING_SCORES_LOGS...</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {leaderboard.map((sc, idx) => (
                <div key={sc.id} className="flex justify-between items-center border-b border-outline-variant/10 pb-1 text-[10px]">
                  <span className="text-primary font-bold">#{idx + 1} {sc.playerName}</span>
                  <span className="text-on-surface-variant font-bold">
                    {sc.score} {selectedGame === "minesweeper" ? "s" : "pts"}
                  </span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-on-surface-variant opacity-50 text-[10px] select-none text-center py-6">
                  NO_SCORES_SUBMITTED_FOR_THIS_SECTOR
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </CRTContainer>
  );
}
