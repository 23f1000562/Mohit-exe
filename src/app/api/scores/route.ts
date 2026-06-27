import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameName = searchParams.get("gameName") || "snake";

    // Minesweeper: lower is better (seconds). Others: higher is better.
    const orderDirection = gameName === "minesweeper" ? "asc" : "desc";

    const scores = await prisma.gameScore.findMany({
      where: { gameName },
      orderBy: { score: orderDirection },
      take: 10,
    });

    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newScore = await prisma.gameScore.create({
      data: {
        playerName: body.playerName || "GUEST_USER",
        gameName: body.gameName.toLowerCase(),
        score: Number(body.score),
      },
    });
    return NextResponse.json({ success: true, score: newScore });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
