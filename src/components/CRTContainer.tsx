"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTerminalStore } from "@/store/useTerminalStore";
import { soundHelper } from "@/lib/sounds";
import { Volume2, VolumeX, Cpu, Monitor, Terminal, Menu, X, Coins } from "lucide-react";

interface CRTContainerProps {
  children: React.ReactNode;
}

export default function CRTContainer({ children }: CRTContainerProps) {
  const pathname = usePathname();
  const { theme, setTheme, isMuted, toggleMute, coins } = useTerminalStore();
  const [scanlinesActive, setScanlinesActive] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (soundHelper) {
      soundHelper.setMuted(isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    if (mounted) {
      const body = document.body;
      if (theme === "amber") {
        body.classList.add("theme-amber");
      } else {
        body.classList.remove("theme-amber");
      }
    }
  }, [theme, mounted]);

  const playClick = () => {
    if (soundHelper) soundHelper.playClick();
  };

  const navLinks = [
    { name: "SYSTEM_OS", href: "/" },
    { name: "CHAR_SHEET", href: "/character" },
    { name: "QUEST_LOG", href: "/projects" },
    { name: "TECH_STACK", href: "/skills" },
    { name: "AI_LAB", href: "/ai-lab" },
    { name: "COM_TERM", href: "/contact" },
    { name: "ARCADE", href: "/arcade" },
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-[#0e0e0f]"></div>;
  }

  return (
    <div className={`crt-screen ${scanlinesActive ? "crt-flicker" : ""} min-h-screen flex flex-col text-on-surface bg-background selection:bg-primary selection:text-on-primary`}>
      {scanlinesActive && <div className="scanlines"></div>}

      {/* Top Bar Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface border-b-4 border-outline-variant select-none">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary w-6 h-6 animate-pulse" />
          <Link
            href="/"
            onClick={playClick}
            className="font-headline text-lg md:text-xl text-primary font-bold tracking-tighter crt-glow"
          >
            MOHIT.EXE v2.0
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={playClick}
                className={`font-label text-xs px-2 py-1 border transition-all ${
                  isActive
                    ? "bg-primary text-on-primary border-primary"
                    : "text-on-surface-variant border-transparent hover:bg-surface-container-highest hover:text-primary hover:border-outline-variant"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Global System Settings */}
        <div className="flex items-center gap-3 font-label text-xs">
          {/* Collected Coins display */}
          <div className="flex items-center gap-1 text-yellow-500 border border-yellow-500/30 px-2 py-1 bg-yellow-500/10">
            <Coins className="w-4 h-4" />
            <span>COINS: {coins.length}/5</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleMute();
              if (soundHelper) {
                if (isMuted) {
                  soundHelper.setMuted(false);
                  soundHelper.playSuccess();
                }
              }
            }}
            className="p-1 border border-outline-variant hover:text-primary hover:border-primary active:translate-y-[2px] cursor-pointer"
            title="Toggle System Sounds"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-primary" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              setTheme(theme === "green" ? "amber" : "green");
              playClick();
            }}
            className="p-1 border border-outline-variant hover:text-primary hover:border-primary active:translate-y-[2px] cursor-pointer"
            title="Toggle CRT Color Scheme"
          >
            <Cpu className={`w-4 h-4 ${theme === "amber" ? "text-amber-500" : "text-primary"}`} />
          </button>

          {/* CRT Overlay Toggle */}
          <button
            onClick={() => {
              setScanlinesActive(!scanlinesActive);
              playClick();
            }}
            className="p-1 border border-outline-variant hover:text-primary hover:border-primary active:translate-y-[2px] cursor-pointer"
            title="Toggle Scanlines / Flicker"
          >
            <Monitor className={`w-4 h-4 ${scanlinesActive ? "text-primary" : ""}`} />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              playClick();
            }}
            className="lg:hidden p-1 border border-outline-variant text-primary cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-40 lg:hidden flex flex-col p-6 border-b-4 border-outline-variant">
          <nav className="flex flex-col gap-4 font-label text-base">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setMenuOpen(false);
                    playClick();
                  }}
                  className={`w-full text-left p-3 border ${
                    isActive
                      ? "bg-primary text-on-primary border-primary"
                      : "text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-primary"
                  }`}
                >
                  &gt; {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16 px-6 max-w-7xl mx-auto w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
