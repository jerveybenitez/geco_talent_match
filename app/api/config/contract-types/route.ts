import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function POST(request: Request) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const contractType = await prisma.contractType.create({
    data: { name, description: description || null },
    select: { id: true, name: true, description: true, active: true },
  });
  return NextResponse.json({ ...contractType, contractsCount: 0 });
}
