import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid resume payload" }, { status: 400 });
    }

    if (Array.isArray(body.skills)) {
      await prisma.skill.deleteMany();
      for (const [index, skill] of body.skills.entries()) {
        await prisma.skill.create({
          data: {
            name: skill.name,
            category: skill.category || "General",
            level: skill.level || 80,
            icon: skill.icon || "code",
            index: index + 1,
          },
        });
      }
    }

    if (Array.isArray(body.experience)) {
      await prisma.experience.deleteMany();
      for (const [index, exp] of body.experience.entries()) {
        await prisma.experience.create({
          data: {
            company: exp.company || "Unknown",
            role: exp.role || "Engineer",
            location: exp.location || "Remote",
            startDate: exp.startDate || "Present",
            endDate: exp.endDate || "Present",
            description: Array.isArray(exp.highlights) ? exp.highlights.join("\n") : exp.description || "",
            technologies: Array.isArray(exp.technologies) ? exp.technologies.join(",") : "",
            index: index + 1,
          },
        });
      }
    }

    if (Array.isArray(body.education)) {
      await prisma.education.deleteMany();
      for (const [index, edu] of body.education.entries()) {
        await prisma.education.create({
          data: {
            institution: edu.institution || "Unknown",
            degree: edu.degree || "Degree",
            fieldOfStudy: edu.fieldOfStudy || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            grade: edu.grade || "",
            index: index + 1,
          },
        });
      }
    }

    if (Array.isArray(body.projects)) {
      await prisma.project.deleteMany();
      for (const project of body.projects) {
        await prisma.project.create({
          data: {
            title: project.title || "Untitled",
            slug: project.slug || project.title?.toLowerCase().replace(/\s+/g, "-") || "project",
            description: project.description || "",
            problem: project.problem || "",
            solution: project.solution || "",
            architecture: project.architecture || "",
            techStack: Array.isArray(project.techStack) ? project.techStack.join(",") : project.techStack || "",
            githubUrl: project.githubUrl || "",
            liveUrl: project.liveUrl || "",
            status: project.status || "PUBLISHED",
            category: project.category || "Web",
            difficulty: Number(project.difficulty) || 3,
            features: Array.isArray(project.highlights) ? project.highlights.join("\n") : "",
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to ingest resume" }, { status: 500 });
  }
}
