import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  active: true,
  image: true,
  countriesHandled: {
    select: { id: true, name: true, countryCode: true },
  },
} as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, email, phone, role, countryIds, active, image } = body as {
    name?: string;
    email?: string;
    phone?: string | null;
    role?: string;
    countryIds?: string[];
    active?: boolean;
    image?: string | null;
  };

  const target = await prisma.user.findUnique({
    where: { id },
    select: { email: true, role: true, _count: { select: { countriesHandled: true } } },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (email && email !== target.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
  }

  if (role !== undefined && !["superadmin", "admin", "user"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const effectiveRole = role ?? target.role;
  const effectiveCountryCount = countryIds !== undefined ? countryIds.length : target._count.countriesHandled;
  if (effectiveRole !== "superadmin" && effectiveCountryCount === 0) {
    return NextResponse.json({ error: "At least one country must be assigned" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(role !== undefined && { role: role as "superadmin" | "admin" | "user" }),
      ...(active !== undefined && { active }),
      ...(image !== undefined && { image }),
      ...(countryIds !== undefined && {
        countriesHandled: { set: countryIds.map((cid) => ({ id: cid })) },
      }),
    },
    select: userSelect,
  });

  return NextResponse.json(user);
}
