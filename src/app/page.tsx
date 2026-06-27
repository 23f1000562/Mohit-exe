"use client";

import React, { useState } from "react";
import CRTContainer from "@/components/CRTContainer";
import TerminalComponent from "@/components/Terminal";
import { useTerminalStore } from "@/store/useTerminalStore";
import { soundHelper } from "@/lib/sounds";
import Link from "next/link";
import {
  FolderCode,
  Terminal as TerminalIcon,
  User as UserIcon,
  Gamepad2,
  Cpu,
  Mail,
  FileText,
  Trophy,
  X,
  Maximize2
} from "lucide-react";

export default function HomePage() {
  const { activeWindows, openWindow, closeWindow } = useTerminalStore();
  const [isFullscreen, setIsFullscreen] = useState<Record<string, boolean>>({});

  const playClick = () => {
    if (soundHelper) soundHelper.playClick();
  };

  const playSuccess = () => {
    if (soundHelper) soundHelper.playSuccess();
  };

  const toggleFullscreen = (winId: string) => {
    playClick();
    setIsFullscreen((prev) => ({ ...prev, [winId]: !prev[winId] }));
  };

  const desktopIcons = [
    {
      id: "terminal",
      label: "SYS_TERMINAL",
      desc: "Command Prompt Shell",
      icon: <TerminalIcon className="w-10 h-10 text-primary" />,
      component: <TerminalComponent />,
    },
    {
      id: "character",
      label: "CHAR_SHEET",
      desc: "Profile & Stats RPG",
      icon: <UserIcon className="w-10 h-10 text-secondary" />,
      href: "/character",
    },
    {
      id: "projects",
      label: "QUEST_LOG",
      desc: "Engineering Quests",
      icon: <FolderCode className="w-10 h-10 text-primary" />,
      href: "/projects",
    },
    {
      id: "arcade",
      label: "ARCADE_CENTER",
      desc: "8-Bit Game Center",
      icon: <Gamepad2 className="w-10 h-10 text-amber-500" />,
      href: "/arcade",
    },
    {
      id: "ailab",
      label: "AI_RESEARCH_LAB",
      desc: "Deep Learning Lab",
      icon: <Cpu className="w-10 h-10 text-purple-400" />,
      href: "/ai-lab",
    },
    {
      id: "resume",
      label: "CV_DOSSIER",
      desc: "Resume & Experience",
      icon: <FileText className="w-10 h-10 text-yellow-400" />,
      href: "/resume",
    },
    {
      id: "achievements",
      label: "ACHV_LOG",
      desc: "Unlocked Milestones",
      icon: <Trophy className="w-10 h-10 text-accent" />,
      href: "/achievements",
    },
    {
      id: "contact",
      label: "COM_TERM",
      desc: "Transmission Save Point",
      icon: <Mail className="w-10 h-10 text-secondary" />,
      href: "/contact",
    },
  ];

  return (
    <CRTContainer>
      <div className="flex-grow flex flex-col relative select-none">
        {/* Ambient Operating System Status */}
        <div className="mb-6 font-mono text-xs text-on-surface-variant flex justify-between items-center border border-outline-variant/30 p-2 bg-surface/50">
          <span>OS_STATUS: RUNNING (KERNEL_OK)</span>
          <span className="hidden md:inline">SYSTEM_TIME: 198X-06-28 // DRIVE: C:\</span>
        </div>

        {/* Grid layout containing Desktop Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-8">
          {desktopIcons.map((icon) => (
            <div key={icon.id} className="flex flex-col items-center">
              {icon.href ? (
                // External navigation shortcuts
                <Link
                  href={icon.href}
                  onClick={playSuccess}
                  className="flex flex-col items-center p-4 border border-transparent hover:border-primary/50 hover:bg-surface-container/30 w-full text-center transition-all cursor-pointer group"
                >
                  <div className="p-2 border-2 border-transparent group-hover:border-primary group-hover:bg-background flex justify-center items-center h-16 w-16 mb-2">
                    {icon.icon}
                  </div>
                  <span className="font-label text-xs tracking-tight text-on-surface group-hover:text-primary">
                    {icon.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant opacity-60 mt-1 hidden md:block">
                    {icon.desc}
                  </span>
                </Link>
              ) : (
                // Dynamic desktop windows shortcuts
                <button
                  onClick={() => {
                    openWindow(icon.id);
                    playSuccess();
                  }}
                  className="flex flex-col items-center p-4 border border-transparent hover:border-primary/50 hover:bg-surface-container/30 w-full text-center transition-all cursor-pointer group focus:outline-none"
                >
                  <div className="p-2 border-2 border-transparent group-hover:border-primary group-hover:bg-background flex justify-center items-center h-16 w-16 mb-2">
                    {icon.icon}
                  </div>
                  <span className="font-label text-xs tracking-tight text-on-surface group-hover:text-primary">
                    {icon.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant opacity-60 mt-1 hidden md:block">
                    {icon.desc}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Operating System Workspace (Window Overlays) */}
        <div className="flex-grow flex flex-col relative min-h-[400px]">
          {desktopIcons
            .filter((icon) => !icon.href && activeWindows.includes(icon.id))
            .map((icon) => {
              const full = isFullscreen[icon.id];
              return (
                <div
                  key={icon.id}
                  className={`border-4 border-outline-variant bg-surface flex flex-col dither-shadow transition-all ${
                    full
                      ? "fixed inset-x-6 bottom-6 top-20 z-40"
                      : "relative w-full max-w-4xl mx-auto my-4 z-20"
                  }`}
                >
                  {/* Window Title Bar */}
                  <div className="bg-outline-variant px-4 py-2 flex justify-between items-center select-none">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-surface" />
                      <span className="font-label text-xs text-surface font-bold">
                        {icon.label}.EXE
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFullscreen(icon.id)}
                        className="w-4 h-4 border border-surface flex items-center justify-center text-surface hover:bg-surface hover:text-outline-variant cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        <Maximize2 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => {
                          closeWindow(icon.id);
                          playClick();
                        }}
                        className="w-4 h-4 border border-surface flex items-center justify-center text-surface hover:bg-surface hover:text-outline-variant cursor-pointer"
                        title="Close Window"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Window Content */}
                  <div className="p-4 flex-grow flex flex-col overflow-y-auto">
                    {icon.component}
                  </div>
                </div>
              );
            })}

          {/* Empty Workspace Placeholder */}
          {activeWindows.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center border-4 border-dashed border-outline-variant/30 p-8 text-center text-on-surface-variant font-mono">
              <TerminalIcon className="w-12 h-12 text-outline-variant/40 mb-4 animate-pulse" />
              <p className="text-sm">WORKSPACE_EMPTY</p>
              <p className="text-xs opacity-60 mt-2">
                Double-click or select any shortcut icon above to launch system modules.
              </p>
            </div>
          )}
        </div>
      </div>
    </CRTContainer>
  );
}
