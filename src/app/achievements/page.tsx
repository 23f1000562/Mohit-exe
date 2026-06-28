import Link from "next/link";
import { prisma } from "@/lib/db";
import CRTContainer from "@/components/CRTContainer";
import { ArrowLeft, Trophy, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany();

  return (
    <CRTContainer>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-on-surface-variant opacity-70 select-none">
        <span>[SYS] LOADING_ACHIEVEMENT_LOGS ... OK</span>
        <Link href="/" className="flex items-center gap-1 hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4" /> BACK_HOME
        </Link>
      </div>

      <div className="space-y-6 rounded border-4 border-outline-variant bg-surface p-6 dither-shadow">
        <div className="border-b-4 border-outline-variant pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h1 className="font-headline text-3xl text-primary crt-glow">ACHIEVEMENT_LOG</h1>
          </div>
          <p className="mt-2 font-body text-sm text-on-surface-variant">
            Unlock milestones across the arcade, terminal, and hidden exploration routes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement: any) => (
            <div key={achievement.id} className="rounded border border-outline-variant/60 bg-surface-container-low p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{achievement.icon || "✨"}</span>
                    <h2 className="font-headline text-lg text-secondary">{achievement.title}</h2>
                  </div>
                  <p className="mt-2 font-body text-sm text-on-surface-variant">{achievement.description}</p>
                </div>
                <div className={`rounded border px-2 py-1 text-[10px] font-bold uppercase ${achievement.unlocked ? "border-primary text-primary" : "border-outline-variant text-on-surface-variant"}`}>
                  {achievement.unlocked ? "UNLOCKED" : "LOCKED"}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase text-on-surface-variant">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {achievement.category}</span>
                <span>{achievement.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CRTContainer>
  );
}
