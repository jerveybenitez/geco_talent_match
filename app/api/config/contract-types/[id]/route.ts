import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { id } = await params;
  const { name, description, active } = await request.json();

  const contractType = await prisma.contractType.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description: description || null }),
      ...(active !== undefined && { active }),
    },
    select: { id: true, name: true, description: true, active: true },
  });

  return NextResponse.json(contractType);
}
