import React from "react";
import { prisma } from "@/lib/db";
import CRTContainer from "@/components/CRTContainer";
import { Code2, Server, Brain, Cloud } from "lucide-react";

export const revalidate = 0;

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { index: "asc" },
  });

  // Group skills by category
  const categories: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    if (!categories[s.category]) {
      categories[s.category] = [];
    }
    categories[s.category].push(s);
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "FRONTEND":
        return <Code2 className="w-5 h-5 text-primary" />;
      case "BACKEND":
        return <Server className="w-5 h-5 text-secondary" />;
      case "AI/ML":
        return <Brain className="w-5 h-5 text-purple-400" />;
      case "DEVOPS":
      default:
        return <Cloud className="w-5 h-5 text-primary-dim" />;
    }
  };

  return (
    <CRTContainer>
      {/* Header */}
      <div className="border-l-8 border-primary pl-4 py-2 mb-8 select-none">
        <h1 className="font-headline text-3xl md:text-4xl text-on-background flex items-center">
          TECH_STACK <span className="ml-4 w-4 h-8 bg-primary cursor-blink"></span>
        </h1>
        <p className="font-body text-xs text-on-surface-variant mt-2 max-w-2xl">
          SYSTEM_STATUS: SECURE. RENDERING ACTIVE PROFICIENCIES IN DIGITIZED CHASSIS BARS...
        </p>
      </div>

      {/* Skills Group Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(categories).map(([catName, catSkills]) => (
          <div key={catName} className="bg-surface border-4 border-outline-variant dither-shadow">
            {/* Group Header */}
            <div className="bg-outline-variant px-4 py-2 flex justify-between items-center select-none">
              <div className="flex items-center gap-2">
                {getCategoryIcon(catName)}
                <span className="font-label text-xs text-surface font-bold uppercase">
                  {catName}_SKILLS
                </span>
              </div>
              <div className="w-2.5 h-2.5 bg-primary"></div>
            </div>

            {/* Group Body */}
            <div className="p-6 space-y-6">
              {catSkills.map((s) => {
                const filledBlocks = Math.round(s.level / 10);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-label text-sm text-primary font-bold">{s.name}</span>
                      <span className="font-label text-xs text-primary-dim font-bold">LVL {s.level}%</span>
                    </div>
                    {/* Blocks container */}
                    <div className="flex w-full overflow-hidden select-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-5 flex-grow max-w-[28px] mr-1 border ${
                            i < filledBlocks
                              ? "bg-primary border-primary shadow-[0_0_4px_#00ff41]"
                              : "border-outline-variant"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CRTContainer>
  );
}
