import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { id } = await params;
  const { name, active } = await request.json();

  const language = await prisma.languages.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(active !== undefined && { active }),
    },
    select: { id: true, name: true, active: true },
  });

  return NextResponse.json(language);
}
