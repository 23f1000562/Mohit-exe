"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTerminalStore } from "@/store/useTerminalStore";
import { soundHelper } from "@/lib/sounds";
import { useRouter } from "next/navigation";

export default function TerminalComponent() {
  const router = useRouter();
  const { history, addHistoryLine, clearHistory, setTheme } = useTerminalStore();
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (soundHelper && e.key.length === 1) {
      soundHelper.playKey();
    }

    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        setCommandHistory((prev) => [...prev, command]);
        setHistoryIndex(-1);
        processCommand(command);
      }
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(nextIndex);
          setInputValue(commandHistory[nextIndex]);
        }
      }
    }
  };

  const processCommand = async (fullCmd: string) => {
    addHistoryLine({ text: `> ${fullCmd}`, type: "input" });
    const parts = fullCmd.toLowerCase().split(" ");
    const cmd = parts[0];
    const arg = parts.slice(1).join(" ");

    switch (cmd) {
      case "help":
        addHistoryLine({ text: "AVAILABLE COMMANDS:", type: "success" });
        addHistoryLine({ text: "  about       - Display narrative profile logs.", type: "info" });
        addHistoryLine({ text: "  skills      - Output the active skill matrices.", type: "info" });
        addHistoryLine({ text: "  projects    - Show quest list from neural storage.", type: "info" });
        addHistoryLine({ text: "  resume      - Output experience and education records.", type: "info" });
        addHistoryLine({ text: "  stats       - Print character level and attributes.", type: "info" });
        addHistoryLine({ text: "  contact     - Display communication links and terminals.", type: "info" });
        addHistoryLine({ text: "  arcade      - Load game center cabinet menu.", type: "info" });
        addHistoryLine({ text: "  achievements- Open the hidden unlock log.", type: "info" });
        addHistoryLine({ text: "  theme [x]   - Change console color (green / amber).", type: "info" });
        addHistoryLine({ text: "  github      - Redirect to source repository.", type: "info" });
        addHistoryLine({ text: "  linkedin    - Redirect to LinkedIn vector network.", type: "info" });
        addHistoryLine({ text: "  clear       - Clear screen buffer.", type: "info" });
        break;

      case "about":
        addHistoryLine({ text: "--- NARRATIVE_ENGINE v1.02 ---", type: "success" });
        addHistoryLine({ text: "Born in the phosphor-glow of early 8-bit systems, Mohit has evolved alongside the architecture of the web. Focus lies at the intersection of extreme technical precision and nostalgic aesthetics.", type: "info" });
        addHistoryLine({ text: "Mission: Bridging the gap between legacy hardware logic and modern machine learning frameworks. Building systems that don't just function—they have a pulse.", type: "info" });
        break;

      case "skills":
        addHistoryLine({ text: "--- ACTIVE SKILL MATRICES ---", type: "success" });
        try {
          const res = await fetch("/api/skills");
          const skills = (await res.json()) as Array<{ name: string; level: number }>;
          if (Array.isArray(skills)) {
            skills.forEach((s) => {
              const blocks = Math.round(s.level / 10);
              const bar = `[${"|".repeat(blocks)}${".".repeat(10 - blocks)}]`;
              addHistoryLine({ text: `  ${s.name.padEnd(15)} ${bar} LVL ${s.level}`, type: "info" });
            });
          } else {
            addHistoryLine({ text: "  Python          [||||||||||] LVL 99\n  JavaScript      [||||||||..] LVL 85\n  TensorFlow      [|||||||||.] LVL 92", type: "info" });
          }
        } catch (_) {
          addHistoryLine({ text: "  Python          [||||||||||] LVL 99\n  JavaScript      [||||||||..] LVL 85\n  TensorFlow      [|||||||||.] LVL 92", type: "info" });
        }
        break;

      case "projects":
        addHistoryLine({ text: "--- NEURAL STORAGE: PROJECTS ---", type: "success" });
        try {
          const res = await fetch("/api/projects");
          const data = (await res.json()) as { projects?: Array<{ title: string; category: string; description: string; slug: string }> };
          const list = data.projects || [];
          if (list.length > 0) {
            list.forEach((p) => {
              addHistoryLine({ text: `* ${p.title} (${p.category}) - ${p.description}`, type: "info" });
              addHistoryLine({ text: `  Link: /projects/${p.slug}`, type: "success" });
            });
          } else {
            addHistoryLine({ text: "* Neural Nexus (AI) - Decentralized visualization dashboard.", type: "info" });
            addHistoryLine({ text: "* Bitwise Architect (Web) - Visual programming compiler.", type: "info" });
          }
        } catch (_) {
          addHistoryLine({ text: "* Neural Nexus (AI) - Decentralized visualization dashboard.", type: "info" });
        }
        break;

      case "resume":
        addHistoryLine({ text: "--- EXPERIENCE & EDUCATION ---", type: "success" });
        addHistoryLine({ text: "EXPERIENCE:", type: "success" });
        addHistoryLine({ text: "  * Neural Solutions (AI Core Engineer) [Jan 2024 - Present]", type: "info" });
        addHistoryLine({ text: "  * Retro Fintech (Lead Frontend Engineer) [Mar 2022 - Dec 2023]", type: "info" });
        addHistoryLine({ text: "  * Bytecode Labs (Fullstack Engineer) [Jun 2020 - Feb 2022]", type: "info" });
        addHistoryLine({ text: "EDUCATION:", type: "success" });
        addHistoryLine({ text: "  * Cybernetic Academy (B.S. in Computer Science) [2016 - 2020]", type: "info" });
        break;

      case "stats":
        addHistoryLine({ text: "--- CHARACTER SHEET ---", type: "success" });
        addHistoryLine({ text: "  Name: S_ENGINEER (Mohit Kishore)", type: "info" });
        addHistoryLine({ text: "  Class: FULLSTACK_ARCHITECT | Level: 42", type: "info" });
        addHistoryLine({ text: "  STR [Backend]  : 92/100  ||  AGI [Frontend] : 88/100", type: "info" });
        addHistoryLine({ text: "  INT [AI/ML]    : 95/100  ||  VIT [DevOps]   : 85/100", type: "info" });
        break;

      case "contact":
        addHistoryLine({ text: "--- COMMUNICATION CHANNELS ---", type: "success" });
        addHistoryLine({ text: "  Email    : contact@mohit.exe", type: "info" });
        addHistoryLine({ text: "  Socials  : type 'github' or 'linkedin' to open networks.", type: "info" });
        addHistoryLine({ text: "  Form     : Redirecting to /contact console...", type: "info" });
        setTimeout(() => router.push("/contact"), 1000);
        break;

      case "arcade":
      case "games":
        addHistoryLine({ text: "Loading game center cabinet menu...", type: "success" });
        if (soundHelper) soundHelper.playSuccess();
        setTimeout(() => router.push("/arcade"), 800);
        break;

      case "achievements":
        addHistoryLine({ text: "Opening achievement log...", type: "success" });
        if (soundHelper) soundHelper.playSuccess();
        setTimeout(() => router.push("/achievements"), 800);
        break;

      case "theme":
        if (arg === "amber" || arg === "green") {
          setTheme(arg);
          addHistoryLine({ text: `Theme updated to: ${arg.toUpperCase()}`, type: "success" });
        } else {
          addHistoryLine({ text: "Usage: theme [green|amber]", type: "error" });
        }
        break;

      case "github":
        addHistoryLine({ text: "Opening repository...", type: "success" });
        window.open("https://github.com", "_blank");
        break;

      case "linkedin":
        addHistoryLine({ text: "Opening LinkedIn vector...", type: "success" });
        window.open("https://linkedin.com", "_blank");
        break;

      case "clear":
        clearHistory();
        break;

      default:
        addHistoryLine({
          text: `Command not recognized: '${cmd}'. Type 'help' for options.`,
          type: "error",
        });
        if (soundHelper) soundHelper.playError();
    }
  };

  const getLineClass = (type: string) => {
    switch (type) {
      case "input":
        return "text-on-surface-variant font-bold";
      case "error":
        return "text-red-500 font-bold crt-glow";
      case "success":
        return "text-secondary font-bold crt-glow-cyan";
      case "info":
      default:
        return "text-primary crt-glow";
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-grow flex flex-col bg-surface border-4 border-outline-variant p-4 font-mono text-sm leading-relaxed overflow-hidden dither-shadow h-[450px]"
    >
      {/* Header bar */}
      <div className="flex justify-between items-center border-b-2 border-outline-variant pb-2 mb-4 select-none">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-primary"></div>
          <div className="w-3 h-3 bg-outline-variant"></div>
        </div>
        <span className="font-label text-xs text-on-surface-variant">SYS_TERMINAL_V1.8</span>
      </div>

      {/* Terminal History */}
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto space-y-2 pr-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {history.map((line, idx) => (
          <div key={idx} className={`${getLineClass(line.type)} whitespace-pre-wrap`}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 border-t-2 border-outline-variant pt-2 mt-4">
        <span className="text-primary font-bold font-mono select-none">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none outline-none text-primary font-mono focus:ring-0 p-0 focus:outline-none"
          placeholder="type a command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <span className="cursor-blink"></span>
      </div>
    </div>
  );
}
