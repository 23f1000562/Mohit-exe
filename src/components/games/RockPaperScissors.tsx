"use client";

import React, { useState } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

type Choice = "ROCK" | "PAPER" | "SCISSORS";

export default function RockPaperScissorsGame() {
  const { submitScore, incrementGamesPlayed, unlockAchievement } = useArcadeStore();
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<"WIN" | "LOSE" | "DRAW" | null>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

  const choices: Choice[] = ["ROCK", "PAPER", "SCISSORS"];

  const playClick = () => soundHelper?.playClick();
  const playSuccess = () => soundHelper?.playSuccess();

  const handleChoice = (choice: Choice) => {
    playClick();
    incrementGamesPlayed("rps");

    const ai = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setAiChoice(ai);

    let outcome: "WIN" | "LOSE" | "DRAW";
    if (choice === ai) {
      outcome = "DRAW";
    } else if (
      (choice === "ROCK" && ai === "SCISSORS") ||
      (choice === "PAPER" && ai === "ROCK") ||
      (choice === "SCISSORS" && ai === "PAPER")
    ) {
      outcome = "WIN";
    } else {
      outcome = "LOSE";
    }

    setResult(outcome);

    if (outcome === "WIN") {
      playSuccess();
      setStats((s) => ({ ...s, wins: s.wins + 1 }));
      submitScore("rps", stats.wins + 1);
      unlockAchievement("first_win");
    } else if (outcome === "LOSE") {
      soundHelper?.playError();
      setStats((s) => ({ ...s, losses: s.losses + 1 }));
    } else {
      setStats((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const getChoiceEmoji = (choice: Choice | null) => {
    switch (choice) {
      case "ROCK": return "✊";
      case "PAPER": return "✋";
      case "SCISSORS": return "✌️";
      default: return "?";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border-2 border-outline-variant w-full max-w-sm mx-auto select-none font-mono">
      <div className="flex justify-between w-full mb-4 font-label text-xs">
        <span className="text-primary font-bold">ROCK_PAPER_SCISSORS</span>
        <span className="text-on-surface-variant font-bold">VERSUS_PORTFOLIO_AI</span>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-2 w-full border border-outline-variant/30 p-2 bg-surface/50 text-center text-xs font-label mb-6">
        <div>WINS: {stats.wins}</div>
        <div>LOSSES: {stats.losses}</div>
        <div>DRAWS: {stats.draws}</div>
      </div>

      {/* Visual Arena */}
      <div className="w-full h-36 border-2 border-outline-variant bg-surface flex items-center justify-around text-center mb-6">
        <div className="space-y-2">
          <p className="text-[10px] text-on-surface-variant font-label uppercase">PLAYER</p>
          <span className="text-5xl">{getChoiceEmoji(playerChoice)}</span>
          <p className="text-xs text-primary font-bold">{playerChoice || "AWAITING..."}</p>
        </div>

        <div className="text-primary crt-glow text-xl font-bold font-label">VS</div>

        <div className="space-y-2">
          <p className="text-[10px] text-on-surface-variant font-label uppercase">PORTFOLIO_AI</p>
          <span className="text-5xl">{getChoiceEmoji(aiChoice)}</span>
          <p className="text-xs text-secondary font-bold">{aiChoice || "AWAITING..."}</p>
        </div>
      </div>

      {/* Outcome text */}
      {result && (
        <div className="text-center font-label text-sm font-bold mb-4">
          {result === "DRAW" ? (
            <span className="text-on-surface-variant">ROUND_DRAW</span>
          ) : result === "WIN" ? (
            <span className="text-primary crt-glow">ROUND_WON (+10 SCORE)</span>
          ) : (
            <span className="text-red-500">ROUND_LOST</span>
          )}
        </div>
      )}

      {/* Choice triggers */}
      <div className="flex gap-4 w-full">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            className="chunky-button flex-1 py-3 text-xs uppercase"
          >
            {choice.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}
