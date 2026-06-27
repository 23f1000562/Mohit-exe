"use client";

import React, { useState } from "react";
import { useTerminalStore } from "@/store/useTerminalStore";
import { soundHelper } from "@/lib/sounds";
import { Sparkles } from "lucide-react";

interface CoinCollectorProps {
  coinId: string;
}

export default function CoinCollector({ coinId }: CoinCollectorProps) {
  const { collectCoin, coins } = useTerminalStore();
  const alreadyCollected = coins.includes(coinId);
  const [collected, setCollected] = useState(alreadyCollected);

  const handleCollect = () => {
    if (collected) return;
    const success = collectCoin(coinId);
    if (success) {
      setCollected(true);
      if (soundHelper) soundHelper.playCoin();
    }
  };

  return (
    <div className="select-none flex justify-center py-4">
      <button
        onClick={handleCollect}
        disabled={collected}
        className={`font-label text-xs px-4 py-2 border-2 flex items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer ${
          collected
            ? "border-yellow-500/30 text-yellow-500/50 bg-yellow-500/5 cursor-default"
            : "border-yellow-500 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20"
        }`}
      >
        <Sparkles className={`w-4 h-4 ${collected ? "" : "animate-bounce"}`} />
        <span>{collected ? "COIN_COLLECTED" : "DISCOVER_HIDDEN_PIXEL_COIN"}</span>
      </button>
    </div>
  );
}
