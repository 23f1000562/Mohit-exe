import React from "react";
import { prisma } from "@/lib/db";
import ProjectsListClient from "./ProjectsListClient";
import CRTContainer from "@/components/CRTContainer";

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CRTContainer>
      <ProjectsListClient projects={projects} />
    </CRTContainer>
  );
}
