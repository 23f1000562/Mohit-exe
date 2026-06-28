import Link from "next/link";
import CRTContainer from "@/components/CRTContainer";
import { ArrowLeft, Download, FileText, Sparkles, Terminal } from "lucide-react";

const highlights = [
  "Full-Stack Development: Next.js, React, TypeScript, Node.js",
  "Backend & Data: Prisma, PostgreSQL, REST APIs, auth flows",
  "AI/ML: Python, TensorFlow, PyTorch, LLM tooling, experimentation",
  "Product Craft: UI systems, accessibility, responsive design, performance",
  "Tools: Docker, GitHub Actions, Vercel, Tailwind, Framer Motion",
];

const education = [
  "BS in Data Science — Indian Institute of Technology Madras",
  "Currently pursuing the degree and continuing to build applied AI and full-stack engineering expertise",
];

export default function ResumePage() {
  return (
    <CRTContainer>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between font-mono text-xs text-on-surface-variant opacity-70 select-none">
        <span>[SYS] OPENING_CV_DOSSIER: /RESUME/MOHIT_KISHORE.TXT ... OK</span>
        <div className="flex items-center gap-2">
          <a
            href="/Mohit_Kishore_Resume.pdf"
            download="Mohit_Kishore_Resume.pdf"
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
              <p className="flex items-center gap-2"><Terminal className="w-4 h-4 text-primary" /> Mohitkishore145@gmail.com</p>
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
