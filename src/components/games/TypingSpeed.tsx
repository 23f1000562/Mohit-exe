"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

export default function TypingSpeedChallenge() {
  const { playerName, submitScore, incrementGamesPlayed, unlockAchievement } = useArcadeStore();
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totalKeys, setTotalKeys] = useState(0);
  const [correctKeys, setCorrectKeys] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const programmingWords = [
    "import", "export", "function", "const", "let", "return", "class", "async",
    "await", "promise", "interface", "type", "extends", "implement", "private",
    "public", "constructor", "super", "yield", "generator", "database", "query",
    "socket", "websocket", "docker", "dockerfile", "compose", "kubernetes",
    "server", "client", "request", "response", "payload", "buffer", "stream"
  ];

  const playClick = () => soundHelper?.playClick();
  const playKey = () => soundHelper?.playKey();
  const playSuccess = () => soundHelper?.playSuccess();

  useEffect(() => {
    initializeChallenge();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const initializeChallenge = () => {
    // Generate 50 random words from dictionary
    const randomWords = Array(50).fill(null).map(() =>
      programmingWords[Math.floor(Math.random() * programmingWords.length)]
    );
    setWordList(randomWords);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(30);
    setStarted(false);
    setFinished(false);
    setTotalKeys(0);
    setCorrectKeys(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;

    const value = e.target.value;
    playKey();

    if (!started) {
      setStarted(true);
      incrementGamesPlayed("typing");
      startTimer();
    }

    const currentWord = wordList[currentWordIndex];

    // Space completes current word
    if (value.endsWith(" ")) {
      const typed = value.trim();
      const matchLength = Math.min(typed.length, currentWord.length);
      
      // Calculate keys matching
      let correct = 0;
      for (let i = 0; i < matchLength; i++) {
        if (typed[i] === currentWord[i]) correct++;
      }

      setCorrectKeys((prev) => prev + correct + (typed === currentWord ? 1 : 0)); // space is bonus
      setTotalKeys((prev) => prev + typed.length + 1);

      setCurrentWordIndex((idx) => Math.min(wordList.length - 1, idx + 1));
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopChallenge();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stopChallenge = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    playSuccess();
  };

  const calculateWpm = () => {
    if (timeLeft === 30) return 0;
    const timeElapsed = (30 - timeLeft) / 60;
    // Standard typing WPM: (correct chars / 5) / (minutes)
    return Math.round((correctKeys / 5) / timeElapsed);
  };

  const calculateAccuracy = () => {
    if (totalKeys === 0) return 0;
    return Math.round((correctKeys / totalKeys) * 100);
  };

  useEffect(() => {
    if (finished) {
      const wpm = calculateWpm();
      submitScore("typing", wpm);
      
      if (wpm >= 80) {
        unlockAchievement("typing_80");
      }
      unlockAchievement("first_win");

      saveScore(wpm);
    }
  }, [finished]);

  const saveScore = async (finalWpm: number) => {
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, gameName: "Typing", score: finalWpm }),
      });
    } catch (_) {}
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border-2 border-outline-variant w-full max-w-sm mx-auto select-none font-mono">
      <div className="flex justify-between w-full mb-4 font-label text-xs">
        <span className="text-primary font-bold">TIME: {timeLeft}s</span>
        <span className="text-secondary font-bold">WPM: {calculateWpm()}</span>
        <span className="text-on-surface-variant font-bold">ACC: {calculateAccuracy()}%</span>
      </div>

      {/* Word stream window */}
      <div className="w-full h-32 border-2 border-outline-variant bg-surface p-4 overflow-hidden relative mb-6">
        <div className="flex flex-wrap gap-2 text-xs select-none">
          {wordList.map((word, idx) => {
            const isCurrent = idx === currentWordIndex;
            const isCompleted = idx < currentWordIndex;
            return (
              <span
                key={idx}
                className={`${
                  isCurrent
                    ? "text-secondary border-b-2 border-secondary font-bold crt-glow-cyan"
                    : isCompleted
                    ? "text-primary opacity-50"
                    : "text-on-surface-variant opacity-80"
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Form typing input */}
      <div className="w-full relative flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1 mb-4">
        <span className="font-mono text-primary font-bold mr-2 select-none">&gt;</span>
        <input
          type="text"
          disabled={finished}
          value={inputValue}
          onChange={handleInputChange}
          className="w-full bg-transparent border-none outline-none text-primary font-mono text-sm focus:ring-0 p-0 focus:outline-none"
          placeholder={started ? "type..." : "type first word to start..."}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <span className="cursor-blink"></span>
      </div>

      {/* Finished Summary details */}
      {finished && (
        <div className="text-center font-label text-sm font-bold">
          <p className="text-primary crt-glow">CHALLENGE_COMPLETE</p>
          <p className="text-[10px] text-on-surface-variant mt-1">
            WPM: {calculateWpm()} // ACCURACY: {calculateAccuracy()}%
          </p>
          <button onClick={initializeChallenge} className="chunky-button-primary mt-2 py-1 px-4 text-xs">
            RETRY_CHALLENGE
          </button>
        </div>
      )}
    </div>
  );
}
