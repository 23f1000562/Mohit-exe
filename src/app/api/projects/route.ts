import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        problem: body.problem,
        solution: body.solution,
        techStack: body.techStack,
        category: body.category,
        difficulty: Number(body.difficulty) || 1,
        status: body.status || "DRAFT",
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        problem: body.problem,
        solution: body.solution,
        techStack: body.techStack,
        category: body.category,
        difficulty: Number(body.difficulty) || 1,
        status: body.status,
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    await prisma.project.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
