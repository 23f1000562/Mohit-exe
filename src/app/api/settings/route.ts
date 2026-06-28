import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = (await prisma.$queryRaw`
      SELECT key, value
      FROM Setting
      ORDER BY key ASC
    `) as Array<{ key: string; value: string }>;
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.key || typeof body.key !== "string" || !body?.value || typeof body.value !== "string") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    await prisma.$executeRaw`
      INSERT INTO Setting (key, value)
      VALUES (${body.key}, ${body.value})
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
