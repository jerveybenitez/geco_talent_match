import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperadmin } from "@/lib/configTableApi";

export async function POST(request: Request) {
  const { error } = await requireSuperadmin();
  if (error) return error;

  const { name, countryCode, phone } = await request.json();
  if (!name || !countryCode || !phone) {
    return NextResponse.json({ error: "Name, country code and phone are required" }, { status: 400 });
  }

  const existing = await prisma.country.findUnique({ where: { countryCode } });
  if (existing) {
    return NextResponse.json({ error: "A country with this code already exists" }, { status: 409 });
  }

  // Superadmins manage every region, so a newly added country should be assigned to all of them right away.
  const superadmins = await prisma.user.findMany({ where: { role: "superadmin" }, select: { id: true } });

  const country = await prisma.country.create({
    data: {
      name,
      countryCode,
      phone,
      users: { connect: superadmins.map((admin) => ({ id: admin.id })) },
    },
    select: { id: true, name: true, countryCode: true, phone: true, active: true },
  });
  return NextResponse.json(country);
}
