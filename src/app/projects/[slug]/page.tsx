import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CRTContainer from "@/components/CRTContainer";
import Link from "next/link";
import CoinCollector from "./CoinCollector";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const difficultyStars = "★".repeat(project.difficulty) + "☆".repeat(5 - project.difficulty);

  return (
    <CRTContainer>
      <div className="mb-4 flex justify-between items-center font-mono text-xs text-on-surface-variant opacity-70 select-none">
        <span>[SYS] RETRIEVING_DATA: /LOGS/PROJECTS/{slug.toUpperCase()}.DAT ... OK</span>
        <Link href="/projects" className="flex items-center gap-1 hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4" /> BACK_TO_QUESTS
        </Link>
      </div>

      <div className="bg-surface border-4 border-outline-variant dither-shadow p-6 space-y-8">
        {/* Header Block */}
        <div className="border-b-4 border-outline-variant pb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl text-primary font-bold crt-glow">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 select-none">
              <span className="text-xs bg-outline-variant text-surface px-2.5 py-0.5 font-label font-bold uppercase">
                {project.category || "GENERAL"}
              </span>
              {project.techStack.split(",").map((tech) => (
                <span
                  key={tech}
                  className="text-xs border border-outline-variant px-2.5 py-0.5 text-on-surface-variant font-mono uppercase"
                >
                  #{tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 select-none">
            <span className="font-label text-xs text-yellow-500 font-bold">
              QUEST_LVL: {project.difficulty * 10}
            </span>
            <span className="font-label text-xs text-primary-dim font-bold">
              DIFFICULTY: {difficultyStars}
            </span>
          </div>
        </div>

        {/* Quest Summary & Problem statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              1. QUEST_OBJECTIVE
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              2. THE_PROBLEM
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.problem || "No problem statement defined."}
            </p>
          </div>
        </div>

        {/* Solution & Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              3. THE_SOLUTION
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.solution || "No solution statement defined."}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              4. ARCHITECTURE_LOG
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.architecture || "No architecture details defined."}
            </p>
          </div>
        </div>

        {/* Features List */}
        {project.features && (
          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              5. KEY_SYSTEM_FEATURES
            </h2>
            <ul className="list-none space-y-2 pl-2">
              {project.features.split("\n").map((feat, idx) => (
                <li key={idx} className="font-body text-sm text-on-surface-variant flex items-start gap-2">
                  <span className="text-primary font-bold select-none">&gt;</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lessons & Future Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              6. LESSONS_LEARNED
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.lessons || "No lessons logs compiled."}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-headline text-xl text-secondary font-bold border-b border-outline-variant/30 pb-2 uppercase">
              7. SYSTEM_FUTURE_SCOPES
            </h2>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {project.future || "No future scopes mapped."}
            </p>
          </div>
        </div>

        {/* Action Panel Links */}
        <div className="border-t-4 border-outline-variant pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="chunky-button flex items-center gap-2 py-2 px-4 border-2"
              >
                <GitBranch className="w-4 h-4" />
                <span>VIEW_SRC_CODE</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="chunky-button-primary flex items-center gap-2 py-2 px-4 border-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>EXECUTE_LIVE_DEMO</span>
              </a>
            )}
          </div>

          <Link href="/projects" className="chunky-button py-2 px-4 border-2">
            RETURN_TO_QUESTS
          </Link>
        </div>
      </div>

      {/* Collectible Easter Egg Coin */}
      <CoinCollector coinId={`coin_project_${slug}`} />
    </CRTContainer>
  );
}
