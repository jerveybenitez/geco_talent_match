import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const STATUSES = ["Available", "Committed", "Former"] as const;

// TODO: replace with a proper invite/reset-password flow instead of a shared default password.
const DEFAULT_CONSULTANT_PASSWORD = "password";

function parseNames(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    name,
    email,
    phone,
    image,
    status,
    jobTitle,
    yearsOfExperience,
    city,
    countryId,
    bio,
    skills,
    industries,
    availableFrom,
    availableTo,
    linkedin,
  } = body as {
    name?: string;
    email?: string;
    phone?: string | null;
    image?: string | null;
    status?: string;
    jobTitle?: string;
    yearsOfExperience?: number | string | null;
    city?: string;
    countryId?: string;
    bio?: string | null;
    skills?: string;
    industries?: string;
    availableFrom?: string;
    availableTo?: string;
    linkedin?: string | null;
  };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  if (!jobTitle) {
    return NextResponse.json({ error: "Role/Position is required" }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }
  if (!countryId) {
    return NextResponse.json({ error: "Country is required" }, { status: 400 });
  }
  if (!availableFrom || !availableTo) {
    return NextResponse.json({ error: "Available From and Contract Expiry dates are required" }, { status: 400 });
  }
  if (status && !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 400 });
  }

  const skillNames = parseNames(skills);
  const industryNames = parseNames(industries);
  const hashedPassword = await bcrypt.hash(DEFAULT_CONSULTANT_PASSWORD, 10);

  const created = await prisma.$transaction(async (tx) => {
    let job = await tx.jobs.findFirst({ where: { name: { equals: jobTitle, mode: "insensitive" } } });
    if (!job) {
      job = await tx.jobs.create({ data: { name: jobTitle } });
    }

    const skillIds: string[] = [];
    for (const skillName of skillNames) {
      let skill = await tx.skills.findFirst({ where: { name: { equals: skillName, mode: "insensitive" } } });
      if (!skill) {
        skill = await tx.skills.create({ data: { name: skillName } });
      }
      skillIds.push(skill.id);
    }

    const industryIds: string[] = [];
    for (const industryName of industryNames) {
      let industry = await tx.industries.findFirst({ where: { name: { equals: industryName, mode: "insensitive" } } });
      if (!industry) {
        industry = await tx.industries.create({ data: { name: industryName } });
      }
      industryIds.push(industry.id);
    }

    return tx.user.create({
      data: {
        name,
        email,
        hashedPassword,
        phone: phone || null,
        image: image || null,
        role: "user",
        active: true,
        countriesHandled: { connect: { id: countryId } },
        consultant: {
          create: {
            status: (status as (typeof STATUSES)[number]) ?? "Available",
            jobId: job.id,
            countryId,
            city,
            linkedin: linkedin || null,
            professionalBio: bio || null,
            yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
            availableFrom: new Date(availableFrom),
            availableTo: new Date(availableTo),
            skills: { connect: skillIds.map((id) => ({ id })) },
            industries: { connect: industryIds.map((id) => ({ id })) },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        consultant: {
          select: { id: true, status: true },
        },
      },
    });
  });

  return NextResponse.json(created, { status: 201 });
}
