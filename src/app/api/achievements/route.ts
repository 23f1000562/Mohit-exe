import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const defaultAchievements = [
  {
    title: "First Victory",
    description: "Claim your first arcade win.",
    icon: "🏆",
    points: 25,
    unlocked: true,
    category: "ARCADE",
    condition: "first_win",
  },
  {
    title: "Snake Master",
    description: "Reach a high score in Snake.",
    icon: "🐍",
    points: 50,
    unlocked: false,
    category: "ARCADE",
    condition: "snake_master",
  },
  {
    title: "Typing Champion",
    description: "Beat the typing speed challenge.",
    icon: "⌨️",
    points: 40,
    unlocked: false,
    category: "ARCADE",
    condition: "typing_champion",
  },
  {
    title: "Memory Genius",
    description: "Complete a perfect Memory Match run.",
    icon: "🧠",
    points: 60,
    unlocked: false,
    category: "ARCADE",
    condition: "memory_genius",
  },
  {
    title: "Arcade Explorer",
    description: "Discover the hidden room.",
    icon: "🕹️",
    points: 35,
    unlocked: true,
    category: "EXPLORATION",
    condition: "arcade_explorer",
  },
  {
    title: "Konami Legend",
    description: "Unlock developer mode through the secret code.",
    icon: "👾",
    points: 80,
    unlocked: false,
    category: "EXPLORATION",
    condition: "konami_code",
  },
];

export async function GET() {
  try {
    const count = await prisma.achievement.count();
    if (count === 0) {
      await prisma.achievement.createMany({
        data: defaultAchievements,
      });
    }

    const achievements = await prisma.achievement.findMany({
      orderBy: { points: "desc" },
    });

    return NextResponse.json({ achievements });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
