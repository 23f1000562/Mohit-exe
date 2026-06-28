"use client";

import React, { useState } from "react";
import Link from "next/link";
import { soundHelper } from "@/lib/sounds";
import { Search, FolderKanban, ShieldCheck, HelpCircle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  techStack: string;
  difficulty: number;
}

interface ProjectsListClientProps {
  projects: Project[];
}

export default function ProjectsListClient({ projects }: ProjectsListClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "WEB", "AI", "ML"];

  const playClick = () => {
    if (soundHelper) soundHelper.playClick();
  };

  const playSuccess = () => {
    if (soundHelper) soundHelper.playSuccess();
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "ALL" ||
      (p.category && p.category.toUpperCase() === activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-l-8 border-primary pl-4 py-2 mb-8 select-none">
        <h2 className="font-headline text-3xl md:text-4xl text-on-background flex items-center">
          QUEST_LOG <span className="ml-4 w-4 h-8 bg-primary cursor-blink"></span>
        </h2>
        <p className="font-body text-xs text-on-surface-variant mt-2 max-w-2xl">
          SYSTEM_STATUS: ACTIVE. RETRIEVING RELEVANT DATA_BLOCKS FROM NEURAL_STORAGE...
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface p-4 border-4 border-outline-variant dither-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 select-none">
          <span className="font-label text-xs text-primary-dim self-center mr-2">FILTER:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                playClick();
              }}
              className={`font-label text-xs px-4 py-2 border-2 cursor-pointer transition-all active:translate-y-[2px] ${
                activeCategory === cat
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat === "ALL" ? "ALL_QUESTS" : cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 flex items-center border-2 border-outline-variant bg-surface-container-low px-2 py-1">
          <span className="font-mono text-primary mr-2 font-bold">&gt;</span>
          <input
            type="text"
            placeholder="Search quest logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={() => soundHelper?.playKey()}
            className="w-full bg-transparent border-none outline-none text-primary font-mono text-xs focus:ring-0 p-0 focus:outline-none"
          />
          <Search className="w-4 h-4 text-on-surface-variant opacity-60 ml-2" />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {filteredProjects.map((p, idx) => {
          const difficultyStars = "★".repeat(p.difficulty) + "☆".repeat(5 - p.difficulty);
          return (
            <div
              key={p.id}
              className="bg-surface border-4 border-outline-variant flex flex-col relative overflow-hidden group dither-shadow"
            >
              {/* Card Header */}
              <div className="bg-outline-variant px-4 py-1.5 flex justify-between items-center select-none">
                <span className="font-label text-[10px] text-surface font-bold">
                  QUEST_0{idx + 1} / LVL_{p.difficulty * 10}
                </span>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 bg-primary"></div>
                  <div className="w-2.5 h-2.5 bg-surface-container-highest"></div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-surface-container-low flex items-center justify-center border-2 border-primary select-none text-primary">
                      {p.category === "AI" ? (
                        <ShieldCheck className="w-8 h-8" />
                      ) : (
                        <FolderKanban className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-headline text-lg text-primary font-bold">{p.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.techStack.split(",").map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] border border-outline-variant px-1.5 text-on-surface-variant font-mono uppercase"
                          >
                            #{tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-xs text-on-surface-variant line-clamp-3 mb-4">
                    {p.description}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-center">
                  <span className="font-label text-[10px] text-yellow-500 font-bold uppercase">
                    DIFF: {difficultyStars}
                  </span>
                  <Link
                    href={`/projects/${p.slug}`}
                    onClick={playSuccess}
                    className="chunky-button-primary py-1 px-3 text-[10px] uppercase font-bold"
                  >
                    BEGIN_QUEST
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-2 border-4 border-dashed border-outline-variant/30 p-12 text-center text-on-surface-variant font-mono">
            <HelpCircle className="w-12 h-12 mx-auto text-outline-variant/40 mb-4" />
            <p className="text-sm">NO_MATCHING_QUEST_LOGS</p>
          </div>
        )}
      </div>
    </div>
  );
}
