import { prisma } from "@/lib/prisma";
import type { FluencyLevel } from "../app/generated/prisma/enums";

export interface TalentProfileLanguage {
  id: string;
  name: string;
  fluency: FluencyLevel;
}

export interface TalentProfileData {
  consultantId: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  countryId: string;
  roleTitle: string;
  yearsOfExperience: number | null;
  linkedin: string | null;
  skills: string[];
  industries: string[];
  languages: TalentProfileLanguage[];
}

export async function getConsultantIdForUser(userId: string): Promise<string | null> {
  const consultant = await prisma.consultant.findUnique({ where: { userId }, select: { id: true } });
  return consultant?.id ?? null;
}

export async function getActiveCountries() {
  return prisma.country.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

/** Returns the talent's own profile, or null if the consultant doesn't exist or isn't owned by sessionUserId. */
export async function getTalentProfileData(
  consultantId: string,
  sessionUserId: string
): Promise<TalentProfileData | null> {
  const consultant = await prisma.consultant.findUnique({
    where: { id: consultantId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      job: { select: { name: true } },
      skills: { select: { skill: { select: { name: true } } } },
      industries: { select: { name: true } },
      languages: { select: { id: true, fluency: true, language: { select: { name: true } } } },
    },
  });

  if (!consultant || consultant.userId !== sessionUserId) {
    return null;
  }

  return {
    consultantId: consultant.id,
    name: consultant.user.name,
    email: consultant.user.email,
    phone: consultant.user.phone,
    city: consultant.city,
    countryId: consultant.countryId,
    roleTitle: consultant.job.name,
    yearsOfExperience: consultant.yearsOfExperience,
    linkedin: consultant.linkedin,
    skills: consultant.skills.map((entry) => entry.skill.name),
    industries: consultant.industries.map((industry) => industry.name),
    languages: consultant.languages.map((entry) => ({
      id: entry.id,
      name: entry.language.name,
      fluency: entry.fluency,
    })),
  };
}
