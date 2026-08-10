import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  resolveSkillIds,
  resolveIndustryIds,
  syncConsultantLanguages,
  type ConsultantLanguageInput,
} from "@/lib/consultantsData";
import { getTalentProfileData } from "@/lib/talentProfileData";
import { parseUniqueTitleCaseNames, toTitleCase } from "@/lib/textUtils";
import { FluencyLevel } from "@/app/generated/prisma/enums";

interface LanguageInput {
  name?: unknown;
  fluency?: unknown;
}

function parseLanguages(value: unknown): ConsultantLanguageInput[] {
  if (!Array.isArray(value)) return [];

  // Keyed by lowercased name so re-entering the same language overwrites the earlier fluency.
  const byName = new Map<string, ConsultantLanguageInput>();
  for (const entry of value as LanguageInput[]) {
    if (!entry || typeof entry.name !== "string") continue;
    const name = toTitleCase(entry.name);
    if (!name) continue;
    if (!Object.values(FluencyLevel).includes(entry.fluency as FluencyLevel)) continue;

    byName.set(name.toLowerCase(), { name, fluency: entry.fluency as FluencyLevel });
  }
  return [...byName.values()];
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role !== "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.consultant.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (existing.userId !== sessionUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, phone, city, countryId, roleTitle, yearsOfExperience, linkedin, skills, industries, languages } =
    body as {
      name?: string;
      phone?: string | null;
      city?: string;
      countryId?: string;
      roleTitle?: string;
      yearsOfExperience?: number | string | null;
      linkedin?: string | null;
      skills?: unknown;
      industries?: unknown;
      languages?: unknown;
    };

  if (!name) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }
  if (!countryId) {
    return NextResponse.json({ error: "Country is required" }, { status: 400 });
  }
  if (!roleTitle) {
    return NextResponse.json({ error: "Role/Title is required" }, { status: 400 });
  }

  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 400 });
  }

  const skillNames = parseUniqueTitleCaseNames(skills);
  const industryNames = parseUniqueTitleCaseNames(industries);
  const languageEntries = parseLanguages(languages);

  await prisma.$transaction(async (tx) => {
    let job = await tx.jobs.findFirst({ where: { name: { equals: roleTitle, mode: "insensitive" } } });
    if (!job) {
      job = await tx.jobs.create({ data: { name: roleTitle } });
    }

    const skillIds = await resolveSkillIds(tx, skillNames);
    const industryIds = await resolveIndustryIds(tx, industryNames);

    await tx.user.update({
      where: { id: sessionUser.id },
      data: { name, phone: phone || null },
    });

    await tx.consultant.update({
      where: { id },
      data: {
        city,
        countryId,
        jobId: job.id,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
        linkedin: linkedin || null,
        skills: { set: skillIds.map((skillId) => ({ id: skillId })) },
        industries: { set: industryIds.map((industryId) => ({ id: industryId })) },
      },
    });

    await syncConsultantLanguages(tx, id, languageEntries);
  });

  const updated = await getTalentProfileData(id, sessionUser.id);
  return NextResponse.json(updated);
}
