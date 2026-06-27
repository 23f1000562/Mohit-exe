"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

type Position = { x: number; y: number };

export default function SnakeGame() {
  const { playerName, submitScore, incrementGamesPlayed, unlockAchievement } = useArcadeStore();
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [dir, setDir] = useState<Position>({ x: 0, y: 0 }); // Idle at start
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(150);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 15;

  const playClick = () => soundHelper?.playClick();
  const playKey = () => soundHelper?.playKey();

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setFood(getRandomPosition());
    setDir({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setSpeed(150);
  };

  const getRandomPosition = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameOver) return;

    if (!started && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      setStarted(true);
      incrementGamesPlayed("snake");
    }

    switch (e.key) {
      case "ArrowUp":
        if (dir.y !== 1) {
          setDir({ x: 0, y: -1 });
          playKey();
        }
        break;
      case "ArrowDown":
        if (dir.y !== -1) {
          setDir({ x: 0, y: 1 });
          playKey();
        }
        break;
      case "ArrowLeft":
        if (dir.x !== 1) {
          setDir({ x: -1, y: 0 });
          playKey();
        }
        break;
      case "ArrowRight":
        if (dir.x !== -1) {
          setDir({ x: 1, y: 0 });
          playKey();
        }
        break;
    }
  };

  useEffect(() => {
    if (!started || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
        };

        // Self collision check
        if (prevSnake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
          setGameOver(true);
          soundHelper?.playError();
          saveScore(score);
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Eat food check
        if (nextHead.x === food.x && nextHead.y === food.y) {
          soundHelper?.playCoin();
          setScore((s) => s + 10);
          setFood(getRandomPosition());
          // Speed up
          setSpeed((sp) => Math.max(70, sp - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setTimeout(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [snake, dir, started, gameOver, speed, food, score]);

  const saveScore = async (finalScore: number) => {
    submitScore("snake", finalScore);

    if (finalScore >= 50) {
      unlockAchievement("snake_50");
    }

    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, gameName: "Snake", score: finalScore }),
      });
    } catch (_) {}
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border-2 border-outline-variant focus:outline-none w-full max-w-md mx-auto focus:border-primary"
    >
      <div className="flex justify-between w-full mb-4 font-label text-xs select-none">
        <span className="text-primary font-bold">SCORE: {score}</span>
        <span className="text-on-surface-variant font-bold">SNAKE.EXE</span>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-15 gap-[1px] bg-outline-variant border-2 border-outline-variant w-full aspect-square relative select-none">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`w-full aspect-square ${
                isHead
                  ? "bg-primary shadow-[0_0_5px_#00ff41]"
                  : isSnake
                  ? "bg-primary-dim opacity-80"
                  : isFood
                  ? "bg-secondary shadow-[0_0_5px_#00daf3] animate-pulse"
                  : "bg-surface"
              }`}
            />
          );
        })}

        {/* Modal Overlay */}
        {(!started || gameOver) && (
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-6 text-center select-none border-2 border-primary">
            {gameOver ? (
              <>
                <h3 className="font-headline text-xl text-red-500 font-bold mb-2">GAME_OVER</h3>
                <p className="font-body text-xs text-on-surface-variant mb-6">
                  Final Score: {score} pts. High scores uploaded.
                </p>
                <button onClick={resetGame} className="chunky-button-primary py-2 px-6">
                  RETRY_GAME
                </button>
              </>
            ) : (
              <>
                <h3 className="font-headline text-lg text-primary font-bold mb-2">SNAKE.SYS</h3>
                <p className="font-body text-xs text-on-surface-variant mb-6">
                  Use your keyboard arrow keys to steer. Loop boundaries permitted.
                </p>
                <p className="font-label text-[10px] text-secondary animate-pulse mb-6">
                  PRESS ANY ARROW KEY TO BEGIN
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
