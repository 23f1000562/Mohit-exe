"use client";

import React, { useState } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

type Player = "X" | "O" | null;

export default function TicTacToeGame() {
  const { submitScore, incrementGamesPlayed, unlockAchievement } = useArcadeStore();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAi, setVsAi] = useState(true);
  const [difficulty, setDifficulty] = useState<"EASY" | "HARD">("HARD");
  const [winner, setWinner] = useState<string | null>(null);

  const playClick = () => soundHelper?.playClick();
  const playSuccess = () => soundHelper?.playSuccess();

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const checkWinner = (squares: Player[]): string | null => {
    for (const [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((square) => square !== null)) {
      return "DRAW";
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    playClick();

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const winStatus = checkWinner(newBoard);
    if (winStatus) {
      handleGameEnd(winStatus);
      return;
    }

    if (vsAi) {
      // Trigger AI turn
      const nextPlayer = "O";
      const aiMove = getAiMove(newBoard, nextPlayer);
      if (aiMove !== -1) {
        newBoard[aiMove] = nextPlayer;
        setBoard(newBoard);
        const aiWinStatus = checkWinner(newBoard);
        if (aiWinStatus) {
          handleGameEnd(aiWinStatus);
        }
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  const getAiMove = (squares: Player[], aiPlayer: "O"): number => {
    if (difficulty === "EASY") {
      const emptyIndices = squares.map((s, idx) => (s === null ? idx : -1)).filter((idx) => idx !== -1);
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    // Minimax algorithm for HARD mode
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = aiPlayer;
        const moveVal = minimax(squares, 0, false);
        squares[i] = null;

        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (squares: Player[], depth: number, isMax: boolean): number => {
    const winStatus = checkWinner(squares);
    if (winStatus === "O") return 10 - depth;
    if (winStatus === "X") return depth - 10;
    if (winStatus === "DRAW") return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = "O";
          best = Math.max(best, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = "X";
          best = Math.min(best, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return best;
    }
  };

  const handleGameEnd = (outcome: string) => {
    setWinner(outcome);
    incrementGamesPlayed("tictactoe");

    if (outcome === "X") {
      playSuccess();
      submitScore("tictactoe", 1); // 1 point for win
      if (vsAi && difficulty === "HARD") {
        unlockAchievement("tictactoe_perfect");
      }
      unlockAchievement("first_win");
    } else if (outcome === "DRAW") {
      playClick();
    } else {
      soundHelper?.playError();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    playClick();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border-2 border-outline-variant w-full max-w-sm mx-auto select-none">
      <div className="flex justify-between w-full mb-4 font-label text-xs">
        <span className="text-primary font-bold">TIC_TAC_TOE</span>
        <div className="flex gap-2">
          <button
            onClick={() => { setVsAi(true); resetGame(); }}
            className={`border px-2 py-0.5 ${vsAi ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant"}`}
          >
            VS_AI
          </button>
          <button
            onClick={() => { setVsAi(false); resetGame(); }}
            className={`border px-2 py-0.5 ${!vsAi ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant"}`}
          >
            PVP
          </button>
        </div>
      </div>

      {vsAi && (
        <div className="flex gap-4 mb-4 font-label text-[10px]">
          <button
            onClick={() => { setDifficulty("EASY"); resetGame(); }}
            className={`border px-2 py-0.5 ${difficulty === "EASY" ? "bg-secondary text-on-secondary border-secondary" : "border-outline-variant text-on-surface-variant"}`}
          >
            AI_EASY
          </button>
          <button
            onClick={() => { setDifficulty("HARD"); resetGame(); }}
            className={`border px-2 py-0.5 ${difficulty === "HARD" ? "bg-secondary text-on-secondary border-secondary" : "border-outline-variant text-on-surface-variant"}`}
          >
            AI_UNBEATABLE
          </button>
        </div>
      )}

      {/* 3x3 Grid board */}
      <div className="grid grid-cols-3 gap-2 bg-outline-variant border-4 border-outline-variant w-full aspect-square p-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className="bg-surface flex items-center justify-center text-primary font-headline text-4xl font-bold cursor-pointer hover:bg-surface-container active:bg-surface-container-low focus:outline-none"
          >
            <span className={cell === "X" ? "text-primary crt-glow" : cell === "O" ? "text-secondary crt-glow-cyan" : ""}>
              {cell}
            </span>
          </button>
        ))}
      </div>

      {/* Match Result Overlay */}
      {winner && (
        <div className="mt-4 text-center font-label text-sm font-bold">
          {winner === "DRAW" ? (
            <p className="text-on-surface-variant">MATCH_DRAW</p>
          ) : (
            <p className={winner === "X" ? "text-primary crt-glow" : "text-red-500"}>
              WINNER: PLAYER_{winner}
            </p>
          )}
          <button onClick={resetGame} className="chunky-button-primary mt-2 py-1 px-4 text-xs">
            PLAY_AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
