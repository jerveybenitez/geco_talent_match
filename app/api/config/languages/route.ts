import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function POST(request: Request) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const language = await prisma.languages.create({ data: { name }, select: { id: true, name: true, active: true } });
  return NextResponse.json(language);
}
