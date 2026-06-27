import React from "react";
import { prisma } from "@/lib/db";
import CRTContainer from "@/components/CRTContainer";
import { Terminal, Shield, Database, Cpu } from "lucide-react";

export const revalidate = 0; // Disable cache to reflect real-time updates

export default async function CharacterPage() {
  // Fetch dynamic content from Prisma
  const skills = await prisma.skill.findMany({
    orderBy: { index: "asc" },
  });

  const achievements = await prisma.achievement.findMany();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const experiences = await prisma.experience.findMany({
    orderBy: { index: "asc" },
  });

  const avatarUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjclm6KHG-zliv9hBAFpimaR9B1hizp1lOJ22VpnAcXQCth8rgQ0bIuNGV9HLRDVbRwKJHHxXqCTxDkvNpQUhWdyH63cisyJhSAXfcSQoZqFFJWT69Lr7I__z0xzFyZ13yPTMgWjKFPLR2dNOow7iQ9D8mkm90KturnzuIoM4_ZkjGvIrJzu32ZC58xhYFCqOG-3vIDkS_wcDOdIsDoCX10WKT_tTPnAKKSuIcE0V_sT5eD1xBa5GYC152m_LgxbzfNrAQqYQj_1s";

  return (
    <CRTContainer>
      <div className="mb-4 font-mono text-xs text-on-surface-variant opacity-70">
        [SYS] ACCESSING_DIRECTORY: /USER/STATS/CHARACTER_SHEET.MD ... OK
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Avatar Panel */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface border-4 border-outline-variant dither-shadow">
            <div className="bg-outline-variant px-4 py-2 flex justify-between items-center">
              <span className="font-label text-xs text-surface font-bold">AVATAR.EXE</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-surface"></div>
                <div className="w-2 h-2 bg-surface"></div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col items-center select-none">
              <div className="relative w-full aspect-square border-4 border-primary p-2 bg-surface-container-low overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale brightness-110 contrast-125"
                  alt="Mohit Kishore Cyber Engineer Avatar"
                  src={avatarUrl}
                />
                <div className="absolute inset-0 border-2 border-primary pointer-events-none opacity-30"></div>
              </div>

              <div className="mt-6 w-full space-y-4">
                <div className="flex justify-between border-b-2 border-outline-variant pb-2">
                  <span className="font-label text-xs text-on-surface-variant">NAME:</span>
                  <span className="font-headline text-lg text-primary crt-glow">S_ENGINEER</span>
                </div>
                <div className="flex justify-between border-b-2 border-outline-variant pb-2">
                  <span className="font-label text-xs text-on-surface-variant">CLASS:</span>
                  <span className="font-body text-sm text-secondary font-bold">FULLSTACK_ARCHITECT</span>
                </div>
                <div className="flex justify-between border-b-2 border-outline-variant pb-2">
                  <span className="font-label text-xs text-on-surface-variant">LVL:</span>
                  <span className="font-body text-sm text-primary font-bold">42</span>
                </div>
                <div className="flex justify-between border-b-2 border-outline-variant pb-2">
                  <span className="font-label text-xs text-on-surface-variant">ACHIEVEMENTS:</span>
                  <span className="font-body text-sm text-primary font-bold">{unlockedCount}/{achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Stats & Bio Panel */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Skill Levels Card */}
          <div className="bg-surface border-4 border-outline-variant dither-shadow">
            <div className="bg-outline-variant px-4 py-2 flex justify-between items-center">
              <span className="font-label text-xs text-surface font-bold">SKILL_MATRICES</span>
              <span className="font-label text-xs text-surface font-bold">TYPE: ACTIVE</span>
            </div>
            
            <div className="p-6 space-y-6">
              {skills.slice(0, 4).map((s) => {
                const filledBlocks = Math.round(s.level / 10);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-label text-sm text-primary font-bold uppercase">{s.name}</span>
                      <span className="font-label text-xs text-primary-dim font-bold">LVL {s.level}</span>
                    </div>
                    <div className="flex w-full overflow-hidden">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-5 w-8 mr-1 border ${
                            i < filledBlocks
                              ? "bg-primary border-primary shadow-[0_0_5px_#00ff41]"
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

          {/* Terminal Bio Box */}
          <div className="bg-surface border-4 border-outline-variant dither-shadow flex-grow">
            <div className="bg-outline-variant px-4 py-2 flex justify-between items-center">
              <span className="font-label text-xs text-surface font-bold">TERMINAL_BIO.LOG</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-surface"></div>
                <div className="w-2 h-2 bg-surface"></div>
              </div>
            </div>

            <div className="p-6 font-body text-sm text-on-surface-variant space-y-4 max-h-[300px] overflow-y-auto">
              <p className="text-primary">&gt; Initializing narrative engine...</p>
              <p className="text-primary-dim">&gt; Loading user_history.dat ... SUCCESS</p>
              <p>
                Born in the phosphor-glow of early 8-bit systems, I&apos;ve evolved alongside the architecture of the web. My focus lies at the intersection of extreme technical precision and nostalgic aesthetics.
              </p>
              <p>
                CURRENT_MISSION: Bridging the gap between legacy hardware logic and modern machine learning frameworks. I build systems that don&apos;t just function—they have a pulse.
              </p>

              <div>
                <p className="text-primary font-bold mb-2">CHRONOLOGY_LOGS:</p>
                <div className="space-y-3 pl-4 border-l-2 border-outline-variant">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <p className="text-secondary font-bold">
                        {exp.company} - {exp.role} ({exp.startDate} - {exp.endDate})
                      </p>
                      <p className="opacity-80 whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-primary">&gt; Waiting for input <span className="cursor-blink"></span></p>
            </div>
          </div>
        </section>
      </div>

      {/* RPG Inventory Items (Bento Extender) */}
      <div className="mt-8">
        <h3 className="font-headline text-lg text-primary mb-4 uppercase crt-glow">EQUIPPED_ITEMS (ACHIEVEMENTS)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.slice(0, 4).map((ach) => (
            <div
              key={ach.id}
              className={`border-2 p-4 text-center transition-all ${
                ach.unlocked
                  ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                  : "bg-surface-container-low border-outline-variant text-on-surface-variant opacity-50 hover:bg-surface-container-high"
              }`}
            >
              <div className="flex justify-center mb-2">
                {ach.condition === "konami_code" ? (
                  <Cpu className="w-8 h-8" />
                ) : ach.condition === "first_win" ? (
                  <Shield className="w-8 h-8" />
                ) : ach.condition === "typing_80" ? (
                  <Terminal className="w-8 h-8" />
                ) : (
                  <Database className="w-8 h-8" />
                )}
              </div>
              <span className="font-label text-xs uppercase block font-bold">{ach.title}</span>
              <span className="text-[10px] block opacity-70 mt-1">{ach.description}</span>
            </div>
          ))}
        </div>
      </div>
    </CRTContainer>
  );
}
