import Link from "next/link";
import CRTContainer from "@/components/CRTContainer";
import { ArrowLeft, Download, FileText, Sparkles, Terminal } from "lucide-react";

const experience = [
  {
    role: "Senior Full-Stack Engineer",
    company: "Neural Forge Labs",
    period: "2023 — Present",
    points: [
      "Architected production-grade Next.js platforms with Prisma, PostgreSQL, and resilient API layers.",
      "Built AI-powered product experiences spanning onboarding, dashboarding, and automation workflows.",
      "Led frontend performance and accessibility improvements with a strong focus on engineering quality.",
    ],
  },
  {
    role: "Lead Frontend Engineer",
    company: "Retro Systems Studio",
    period: "2021 — 2023",
    points: [
      "Designed immersive product interfaces with React, TypeScript, and design systems.",
      "Improved delivery velocity through reusable component architecture and engineering standards.",
      "Collaborated across product, design, and backend teams to ship polished, measurable experiences.",
    ],
  },
];

const highlights = [
  "Full-Stack Development: Next.js, React, TypeScript, Node.js",
  "Backend & Data: Prisma, PostgreSQL, REST APIs, auth flows",
  "AI/ML: Python, TensorFlow, PyTorch, LLM tooling, experimentation",
  "Product Craft: UI systems, accessibility, responsive design, performance",
  "Tools: Docker, GitHub Actions, Vercel, Tailwind, Framer Motion",
];

const education = [
  "B.Tech in Computer Science — 2018–2022",
  "Specialized in software engineering, distributed systems, and applied AI",
];

export default function ResumePage() {
  return (
    <CRTContainer>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-on-surface-variant opacity-70 select-none">
        <span>[SYS] OPENING_CV_DOSSIER: /RESUME/MOHIT_KISHORE.TXT ... OK</span>
        <div className="flex items-center gap-2">
          <a
            href="/Mohit_Kishore_Resume.txt"
            download
            className="chunky-button flex items-center gap-2 px-3 py-2"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD_CV
          </a>
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-all">
            <ArrowLeft className="w-4 h-4" /> BACK_HOME
          </Link>
        </div>
      </div>

      <div className="space-y-6 rounded border-4 border-outline-variant bg-surface p-6 dither-shadow">
        <div className="border-b-4 border-outline-variant pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">MOHIT KISHORE</p>
              <h1 className="font-headline text-3xl text-primary crt-glow">Full-Stack Engineer • AI/ML Builder</h1>
              <p className="mt-3 max-w-2xl font-body text-sm text-on-surface-variant leading-relaxed">
                I build polished digital products that blend product thinking, clean engineering, and thoughtful UX. My work spans modern web platforms, AI experiences, and retro-inspired interfaces that feel as memorable as they are reliable.
              </p>
            </div>
            <div className="rounded border border-outline-variant bg-surface-container p-3 font-mono text-xs text-on-surface-variant">
              <p className="flex items-center gap-2"><Terminal className="w-4 h-4 text-primary" /> contact@mohit.exe</p>
              <p className="mt-2 flex items-center gap-2"><FileText className="w-4 h-4 text-secondary" /> github.com / linkedin.com</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-headline text-xl text-secondary">PROFESSIONAL SUMMARY</h2>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Engineering-focused product builder with experience delivering high-quality web applications, developer experiences, and AI-enabled features. Comfortable from UI implementation to backend architecture and system design.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-headline text-xl text-secondary">CORE SKILLS</h2>
            </div>
            <ul className="space-y-2 font-body text-sm text-on-surface-variant">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-headline text-xl text-secondary">EXPERIENCE</h2>
          </div>
          <div className="space-y-4">
            {experience.map((job) => (
              <div key={job.role} className="rounded border border-outline-variant/60 bg-surface-container-low p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-headline text-lg text-primary">{job.role}</h3>
                    <p className="font-label text-xs uppercase text-on-surface-variant">{job.company}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-secondary">{job.period}</span>
                </div>
                <ul className="mt-3 space-y-2 font-body text-sm text-on-surface-variant">
                  {job.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-headline text-xl text-secondary">EDUCATION</h2>
            </div>
            <ul className="space-y-2 font-body text-sm text-on-surface-variant">
              {education.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-headline text-xl text-secondary">SELECTED PROJECTS</h2>
            </div>
            <ul className="space-y-2 font-body text-sm text-on-surface-variant">
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span><span>MOHIT.EXE v2 — retro portfolio OS with interactive terminal, arcade games, and dynamic content.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span><span>Bitwise Architect — full-stack engineering showcase with modular product architecture.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary">&gt;</span><span>AI Lab — interactive demos for machine learning, vision, and LLM workflows.</span></li>
            </ul>
          </section>
        </div>
      </div>
    </CRTContainer>
  );
}
