"use client";

import React, { useState, useEffect } from "react";
import { soundHelper } from "@/lib/sounds";
import { useArcadeStore } from "@/store/useArcadeStore";

type Card = {
  id: number;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatchGame() {
  const { submitScore, incrementGamesPlayed, unlockAchievement } = useArcadeStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const techIcons = [
    "PYTHON", "REACT", "NEXTJS", "TENSORFLOW",
    "DOCKER", "PYTORCH", "NODEJS", "POSTGRES"
  ];

  const playClick = () => soundHelper?.playClick();
  const playSuccess = () => soundHelper?.playSuccess();

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = () => {
    // 16 cards (8 pairs)
    const cardData: string[] = [...techIcons, ...techIcons];
    // Shuffle
    for (let i = cardData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
    }

    const newCards: Card[] = cardData.map((label, index) => ({
      id: index,
      label,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    playClick();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (moves === 0) {
        incrementGamesPlayed("memory");
      }
      checkForMatch(nextFlipped, newCards);
    }
  };

  const checkForMatch = (flipped: number[], currentCards: Card[]) => {
    const [first, second] = flipped;
    if (currentCards[first].label === currentCards[second].label) {
      // Matched
      setTimeout(() => {
        currentCards[first].isMatched = true;
        currentCards[second].isMatched = true;
        setCards([...currentCards]);
        setFlippedIndices([]);
        
        soundHelper?.playCoin();

        // Check Game Over
        if (currentCards.every((c) => c.isMatched)) {
          setGameOver(true);
          playSuccess();
          submitScore("memory", moves + 1);
          if (moves + 1 <= 20) {
            unlockAchievement("memory_20_moves");
          }
          unlockAchievement("first_win");
        }
      }, 500);
    } else {
      // Unmatched: flip back
      setTimeout(() => {
        currentCards[first].isFlipped = false;
        currentCards[second].isFlipped = false;
        setCards([...currentCards]);
        setFlippedIndices([]);
        soundHelper?.playError();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border-2 border-outline-variant w-full max-w-sm mx-auto select-none font-mono">
      <div className="flex justify-between w-full mb-4 font-label text-xs">
        <span className="text-primary font-bold">MOVES: {moves}</span>
        <span className="text-on-surface-variant font-bold">MEMORY_MATCH</span>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-4 gap-2 bg-outline-variant border-4 border-outline-variant w-full aspect-square p-2">
        {cards.map((card, idx) => {
          const shown = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`flex items-center justify-center font-label text-[9px] font-bold border-2 transition-all active:scale-95 focus:outline-none cursor-pointer ${
                card.isMatched
                  ? "bg-primary/20 border-primary text-primary crt-glow"
                  : shown
                  ? "bg-surface border-secondary text-secondary crt-glow-cyan"
                  : "bg-[#131314] border-outline-variant text-transparent hover:bg-surface-container-high"
              }`}
            >
              {shown ? card.label : "?"}
            </button>
          );
        })}
      </div>

      {/* Win screen overlay */}
      {gameOver && (
        <div className="mt-4 text-center font-label text-sm font-bold">
          <p className="text-primary crt-glow font-bold">DATABASE_DECRYPTED</p>
          <p className="text-[10px] text-on-surface-variant mt-1">Completed in {moves} moves.</p>
          <button onClick={initializeCards} className="chunky-button-primary mt-2 py-1 px-4 text-xs">
            PLAY_AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
