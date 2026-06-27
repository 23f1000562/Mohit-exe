"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";
import { Flag, Bomb, Smile, Frown } from "lucide-react";

type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  mineCount: number;
};

export default function MinesweeperGame() {
  const { playerName, submitScore, incrementGamesPlayed } = useArcadeStore();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mineCount, setMineCount] = useState(10);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const playClick = () => soundHelper?.playClick();
  const playKey = () => soundHelper?.playKey();

  useEffect(() => {
    resetGrid();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    stopTimer();
    timerIntervalRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const resetGrid = () => {
    stopTimer();
    setTimer(0);
    setGameOver(false);
    setWin(false);
    setStarted(false);
    setMineCount(MINES);

    // 1. Initialize empty grid
    let newGrid: Cell[][] = Array(ROWS).fill(null).map((_, r) =>
      Array(COLS).fill(null).map((_, c) => ({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        mineCount: 0,
      }))
    );

    // 2. Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Compute neighbor mine counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              if (newGrid[nr][nc].isMine) count++;
            }
          }
        }
        newGrid[r][c].mineCount = count;
      }
    }

    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || win || grid[row][col].isRevealed || grid[row][col].isFlagged) return;

    playClick();

    if (!started) {
      setStarted(true);
      startTimer();
      incrementGamesPlayed("minesweeper");
    }

    const newGrid = [...grid.map((r) => [...r])];
    const cell = newGrid[row][col];

    if (cell.isMine) {
      // Game Over: Reveal all mines
      setGameOver(true);
      stopTimer();
      soundHelper?.playError();
      revealAll(newGrid);
      return;
    }

    revealCell(newGrid, row, col);
    setGrid(newGrid);

    // Check Win
    checkWinCondition(newGrid);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || win || grid[row][col].isRevealed) return;

    playKey();

    const newGrid = [...grid.map((r) => [...r])];
    const cell = newGrid[row][col];
    cell.isFlagged = !cell.isFlagged;

    setMineCount((m) => m + (cell.isFlagged ? -1 : 1));
    setGrid(newGrid);
  };

  const revealCell = (newGrid: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) return;

    newGrid[r][c].isRevealed = true;

    if (newGrid[r][c].mineCount === 0 && !newGrid[r][c].isMine) {
      // Flood fill neighbors
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(newGrid, r + dr, c + dc);
        }
      }
    }
  };

  const revealAll = (newGrid: Cell[][]) => {
    newGrid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.isMine) cell.isRevealed = true;
      })
    );
    setGrid(newGrid);
  };

  const checkWinCondition = (newGrid: Cell[][]) => {
    const won = newGrid.every((row) =>
      row.every((cell) => cell.isMine || cell.isRevealed)
    );

    if (won) {
      setWin(true);
      stopTimer();
      soundHelper?.playSuccess();
      saveScore(timer);
    }
  };

  const saveScore = async (finalTime: number) => {
    submitScore("minesweeper", finalTime);
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, gameName: "Minesweeper", score: finalTime }),
      });
    } catch (_) {}
  };

  return (
    <div className="flex flex-col items-center p-4 bg-surface border-2 border-outline-variant w-full max-w-sm mx-auto select-none">
      {/* Windows 98 Dashboard */}
      <div className="bg-[#c0c0c0] text-[#000] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] p-2 w-full flex flex-col gap-4 font-mono text-sm">
        <div className="flex justify-between items-center bg-[#808080] p-1.5 border border-inset text-white text-xs font-bold font-label">
          <span>MINESWEEPER_STATION</span>
          <button onClick={resetGrid} className="cursor-pointer bg-[#c0c0c0] text-black border px-1 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]">
            RESET
          </button>
        </div>

        {/* Status header */}
        <div className="flex justify-between items-center bg-[#c0c0c0] border-2 border-r-[#fff] border-b-[#fff] border-l-[#808080] border-t-[#808080] p-2 h-12">
          {/* Mine count */}
          <div className="bg-black text-red-500 font-bold px-3 py-1 font-mono text-xl w-14 text-center">
            {String(Math.max(0, mineCount)).padStart(3, "0")}
          </div>

          {/* Smiley button */}
          <button
            onClick={resetGrid}
            className="w-8 h-8 border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-r-[#fff] active:border-b-[#fff] active:border-l-[#808080] active:border-t-[#808080] flex items-center justify-center cursor-pointer bg-[#c0c0c0]"
          >
            {gameOver ? <Frown className="w-5 h-5 text-red-600" /> : <Smile className="w-5 h-5 text-yellow-600" />}
          </button>

          {/* Timer */}
          <div className="bg-black text-red-500 font-bold px-3 py-1 font-mono text-xl w-14 text-center">
            {String(Math.min(999, timer)).padStart(3, "0")}
          </div>
        </div>

        {/* Minesweeper Grid */}
        <div className="border-2 border-r-[#fff] border-b-[#fff] border-l-[#808080] border-t-[#808080] p-1 bg-[#808080] grid grid-cols-9 gap-[1.5px]">
          {grid.map((row) =>
            row.map((cell) => {
              const isRevealed = cell.isRevealed;
              const isFlagged = cell.isFlagged;
              const isMine = cell.isMine;

              let cellStyle = "w-full aspect-square border-2 flex items-center justify-center font-bold text-xs ";
              if (isRevealed) {
                cellStyle += "bg-[#c0c0c0] border-[#808080] ";
              } else {
                cellStyle += "bg-[#c0c0c0] border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-0 hover:bg-[#d0d0d0] cursor-pointer ";
              }

              const getNumberColor = (num: number) => {
                switch (num) {
                  case 1: return "text-blue-800";
                  case 2: return "text-green-800";
                  case 3: return "text-red-800";
                  case 4: return "text-purple-800";
                  default: return "text-black";
                }
              };

              return (
                <div
                  key={`${cell.row}-${cell.col}`}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                  onContextMenu={(e) => handleRightClick(e, cell.row, cell.col)}
                  className={cellStyle}
                >
                  {isRevealed ? (
                    isMine ? (
                      <Bomb className="w-4 h-4 text-black" />
                    ) : cell.mineCount > 0 ? (
                      <span className={getNumberColor(cell.mineCount)}>{cell.mineCount}</span>
                    ) : null
                  ) : isFlagged ? (
                    <Flag className="w-3 h-3 text-red-600 fill-red-600" />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
