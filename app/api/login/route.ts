import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.active) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set("session_id", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return NextResponse.json({
    name: user.name,
    role: user.role,
  });
}