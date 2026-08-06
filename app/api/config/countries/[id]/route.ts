import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { id } = await params;
  const { name, countryCode, phone, active } = await request.json();

  if (countryCode !== undefined) {
    const existing = await prisma.country.findUnique({ where: { countryCode } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "A country with this code already exists" }, { status: 409 });
    }
  }

  const country = await prisma.country.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(countryCode !== undefined && { countryCode }),
      ...(phone !== undefined && { phone }),
      ...(active !== undefined && { active }),
    },
    select: { id: true, name: true, countryCode: true, phone: true, active: true },
  });

  return NextResponse.json(country);
}
