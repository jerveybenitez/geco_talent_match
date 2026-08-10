import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { resolveSkillIds } from "@/lib/consultantsData";
import { parseUniqueTitleCaseNames } from "@/lib/textUtils";

const STATUSES = ["Available", "Committed", "Former"] as const;

function parseNames(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.consultant.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Consultant not found" }, { status: 404 });
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

  const emailOwner = await prisma.user.findUnique({ where: { email } });
  if (emailOwner && emailOwner.id !== existing.userId) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 400 });
  }

  const skillNames = parseUniqueTitleCaseNames(skills);
  const industryNames = parseNames(industries);

  const updated = await prisma.$transaction(async (tx) => {
    let job = await tx.jobs.findFirst({ where: { name: { equals: jobTitle, mode: "insensitive" } } });
    if (!job) {
      job = await tx.jobs.create({ data: { name: jobTitle } });
    }

    const skillIds = await resolveSkillIds(tx, skillNames);

    const industryIds: string[] = [];
    for (const industryName of industryNames) {
      let industry = await tx.industries.findFirst({ where: { name: { equals: industryName, mode: "insensitive" } } });
      if (!industry) {
        industry = await tx.industries.create({ data: { name: industryName } });
      }
      industryIds.push(industry.id);
    }

    return tx.user.update({
      where: { id: existing.userId },
      data: {
        name,
        email,
        phone: phone || null,
        image: image || null,
        countriesHandled: { set: [{ id: countryId }] },
        consultant: {
          update: {
            status: (status as (typeof STATUSES)[number]) ?? "Available",
            jobId: job.id,
            countryId,
            city,
            linkedin: linkedin || null,
            professionalBio: bio || null,
            yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
            availableFrom: new Date(availableFrom),
            availableTo: new Date(availableTo),
            skills: { set: skillIds.map((id) => ({ id })) },
            industries: { set: industryIds.map((id) => ({ id })) },
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

  return NextResponse.json(updated, { status: 200 });
}
