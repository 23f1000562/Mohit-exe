"use client";

import React, { useState, useEffect } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

export default function Game2048() {
  const { submitScore, incrementGamesPlayed } = useArcadeStore();
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const playClick = () => soundHelper?.playClick();
  const playKey = () => soundHelper?.playKey();

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    let newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  const addRandomTile = (currentBoard: number[][]): number[][] => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) return currentBoard;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...currentBoard.map((row) => [...row])];
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameOver) return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      if (!started) {
        setStarted(true);
        incrementGamesPlayed("2048");
      }

      let moved = false;
      let newBoard = [...board.map((row) => [...row])];
      let gainedScore = 0;

      switch (e.key) {
        case "ArrowLeft":
          [newBoard, gainedScore, moved] = slideLeft(newBoard);
          break;
        case "ArrowRight":
          [newBoard, gainedScore, moved] = slideRight(newBoard);
          break;
        case "ArrowUp":
          [newBoard, gainedScore, moved] = slideUp(newBoard);
          break;
        case "ArrowDown":
          [newBoard, gainedScore, moved] = slideDown(newBoard);
          break;
      }

      if (moved) {
        playKey();
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore((s) => s + gainedScore);

        if (checkGameOver(newBoard)) {
          setGameOver(true);
          soundHelper?.playError();
          submitScore("2048", score + gainedScore);
        }
      }
    }
  };

  const slideLeft = (currentBoard: number[][]): [number[][], number, boolean] => {
    let moved = false;
    let gainedScore = 0;
    const newBoard = currentBoard.map((row) => {
      // 1. Filter out zeros
      let compressed = row.filter((val) => val !== 0);
      // 2. Merge identical adjacent values
      for (let i = 0; i < compressed.length - 1; i++) {
        if (compressed[i] === compressed[i + 1]) {
          compressed[i] *= 2;
          gainedScore += compressed[i];
          compressed[i + 1] = 0;
          moved = true;
        }
      }
      // 3. Compress again after merging
      compressed = compressed.filter((val) => val !== 0);
      // 4. Pad with zeros to size 4
      while (compressed.length < 4) {
        compressed.push(0);
      }
      if (compressed.join(",") !== row.join(",")) {
        moved = true;
      }
      return compressed;
    });

    return [newBoard, gainedScore, moved];
  };

  const slideRight = (currentBoard: number[][]): [number[][], number, boolean] => {
    const reversed = currentBoard.map((row) => [...row].reverse());
    const [slid, gainedScore, moved] = slideLeft(reversed);
    const result = slid.map((row) => [...row].reverse());
    return [result, gainedScore, moved];
  };

  const slideUp = (currentBoard: number[][]): [number[][], number, boolean] => {
    // Transpose
    let transposed = Array(4).fill(null).map((_, c) => Array(4).fill(null).map((_, r) => currentBoard[r][c]));
    let [slid, gainedScore, moved] = slideLeft(transposed);
    // Transpose back
    let result = Array(4).fill(null).map((_, r) => Array(4).fill(null).map((_, c) => slid[c][r]));
    return [result, gainedScore, moved];
  };

  const slideDown = (currentBoard: number[][]): [number[][], number, boolean] => {
    let transposed = Array(4).fill(null).map((_, c) => Array(4).fill(null).map((_, r) => currentBoard[r][c]));
    let [slid, gainedScore, moved] = slideRight(transposed);
    let result = Array(4).fill(null).map((_, r) => Array(4).fill(null).map((_, c) => slid[c][r]));
    return [result, gainedScore, moved];
  };

  const checkGameOver = (currentBoard: number[][]): boolean => {
    // If empty cell exists
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) return false;
      }
    }
    // If adjacent cells are mergeable
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
        if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
      }
    }
    return true;
  };

  const getTileLabel = (val: number): string => {
    if (val === 0) return "";
    // Technology icons mapping for higher values
    switch (val) {
      case 256: return "FLASK";
      case 512: return "DOCKER";
      case 1024: return "TENSOR";
      case 2048: return "REACT";
      case 4096: return "NEXTJS";
      default: return String(val);
    }
  };

  const getTileColorClass = (val: number): string => {
    switch (val) {
      case 2: return "bg-surface border-outline-variant text-on-surface-variant";
      case 4: return "bg-surface-container border-outline text-on-surface";
      case 8: return "bg-outline-variant/30 border-primary text-primary font-bold shadow-[0_0_2px_#00ff41]";
      case 16: return "bg-outline-variant/50 border-primary text-primary font-bold shadow-[0_0_4px_#00ff41]";
      case 32: return "bg-secondary/10 border-secondary text-secondary font-bold shadow-[0_0_2px_#00daf3]";
      case 64: return "bg-secondary/20 border-secondary text-secondary font-bold shadow-[0_0_4px_#00daf3]";
      case 128: return "bg-accent/10 border-accent text-accent font-bold shadow-[0_0_2px_#ffabf3]";
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
        return "bg-primary border-primary text-on-primary font-bold shadow-[0_0_6px_#00ff41] crt-glow";
      default:
        return "bg-surface border-outline-variant text-transparent";
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col items-center justify-center p-4 bg-surface border-2 border-outline-variant focus:outline-none w-full max-w-sm mx-auto select-none font-mono focus:border-primary"
    >
      <div className="flex justify-between w-full mb-4 font-label text-xs">
        <span className="text-primary font-bold">SCORE: {score}</span>
        <span className="text-on-surface-variant font-bold">GAME_2048</span>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-4 gap-2 bg-outline-variant border-4 border-outline-variant w-full aspect-square p-2 relative">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center text-center font-label text-[10px] border-2 transition-all duration-75 ${getTileColorClass(val)}`}
          >
            {val > 0 && (
              <>
                <span className="font-bold text-xs">{getTileLabel(val)}</span>
                {val >= 256 && <span className="text-[7px] opacity-75">{val}</span>}
              </>
            )}
          </div>
        ))}

        {/* Modal display for Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-6 text-center border-2 border-primary">
            <h3 className="font-headline text-xl text-red-500 font-bold mb-2">GAME_OVER</h3>
            <p className="font-body text-xs text-on-surface-variant mb-6">
              Final Score: {score} pts.
            </p>
            <button onClick={resetGame} className="chunky-button-primary py-2 px-6">
              RETRY_GAME
            </button>
          </div>
        )}
      </div>

      <p className="font-label text-[9px] text-on-surface-variant opacity-60 mt-4 text-center">
        USE KEYBOARD ARROW KEYS TO SLIDE TILES.
      </p>
    </div>
  );
}
