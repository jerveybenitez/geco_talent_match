import { prisma } from "@/lib/prisma";
import { getContractsForConsultant, type ContractListItem } from "@/lib/contractsData";
import type { Prisma } from "../app/generated/prisma/client";
import type { FluencyLevel } from "../app/generated/prisma/enums";

export interface ConsultantLanguageItem {
  id: string;
  name: string;
  fluency: FluencyLevel;
}

export interface ConsultantListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  role: string;
  city: string;
  country: string;
  status: "Available" | "Committed" | "Former";
  skills: string[];
  industries: string[];
  contractExpiry: string;
}

export interface ConsultantProfileData extends ConsultantListItem {
  countryId: string;
  bio: string | null;
  linkedin: string | null;
  yearsOfExperience: number | null;
  availableFrom: string;
  availableTo: string;
  contracts: ContractListItem[];
  languages: ConsultantLanguageItem[];
}

async function getAdminCountries(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { countriesHandled: true },
  });

  if (!user) {
    return null;
  }

  return {
    countryIds: user.countriesHandled.map((country) => country.id),
    countries: user.countriesHandled
      .filter((country) => country.active)
      .map((country) => ({
        id: country.id,
        name: country.name,
        code: country.countryCode,
      })),
  };
}

export async function getConsultantsData(userId: string) {
  const admin = await getAdminCountries(userId);
  if (!admin) {
    return null;
  }

  const consultants = await prisma.consultant.findMany({
    where: {
      active: true,
      countryId: { in: admin.countryIds },
    },
    orderBy: { dateCreate: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true, image: true } },
      job: { select: { name: true } },
      country: { select: { name: true } },
      skills: { select: { name: true } },
      industries: { select: { name: true } },
      contracts: {
        where: { active: true },
        orderBy: { contractendDate: "asc" },
        take: 1,
        select: { contractendDate: true },
      },
    },
  });

  const consultantList: ConsultantListItem[] = consultants.map((consultant) => ({
    id: consultant.id,
    name: consultant.user.name,
    email: consultant.user.email,
    phone: consultant.user.phone,
    photo: consultant.user.image,
    role: consultant.job.name,
    city: consultant.city,
    country: consultant.country.name,
    status: consultant.status,
    skills: consultant.skills.map((skill) => skill.name),
    industries: consultant.industries.map((industry) => industry.name),
    contractExpiry: (consultant.contracts[0]?.contractendDate ?? consultant.availableTo).toISOString(),
  }));

  return { consultants: consultantList, countries: admin.countries };
}

export async function getConsultantById(id: string, adminUserId: string) {
  const admin = await getAdminCountries(adminUserId);
  if (!admin) {
    return null;
  }

  const consultant = await prisma.consultant.findFirst({
    where: {
      id,
      active: true,
      countryId: { in: admin.countryIds },
    },
    include: {
      user: { select: { name: true, email: true, phone: true, image: true } },
      job: { select: { name: true } },
      country: { select: { name: true } },
      skills: { select: { name: true } },
      industries: { select: { name: true } },
      languages: { select: { id: true, fluency: true, language: { select: { name: true } } } },
      contracts: {
        where: { active: true },
        orderBy: { contractendDate: "asc" },
        take: 1,
        select: { contractendDate: true },
      },
    },
  });

  if (!consultant) {
    return null;
  }

  const contracts = await getContractsForConsultant(consultant.id);

  const consultantData: ConsultantProfileData = {
    id: consultant.id,
    name: consultant.user.name,
    email: consultant.user.email,
    phone: consultant.user.phone,
    photo: consultant.user.image,
    role: consultant.job.name,
    city: consultant.city,
    country: consultant.country.name,
    countryId: consultant.countryId,
    status: consultant.status,
    skills: consultant.skills.map((skill) => skill.name),
    industries: consultant.industries.map((industry) => industry.name),
    contractExpiry: (consultant.contracts[0]?.contractendDate ?? consultant.availableTo).toISOString(),
    bio: consultant.professionalBio,
    linkedin: consultant.linkedin,
    yearsOfExperience: consultant.yearsOfExperience,
    availableFrom: consultant.availableFrom.toISOString(),
    availableTo: consultant.availableTo.toISOString(),
    contracts,
    languages: consultant.languages.map((entry) => ({
      id: entry.id,
      name: entry.language.name,
      fluency: entry.fluency,
    })),
  };

  return { consultant: consultantData, countries: admin.countries };
}

/**
 * Resolves title-cased skill names to Skills row ids, creating rows that don't
 * exist yet and re-casing existing rows that were saved with inconsistent casing.
 */
export async function resolveSkillIds(tx: Prisma.TransactionClient, skillNames: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of skillNames) {
    const existing = await tx.skills.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
    if (existing) {
      if (existing.name !== name) {
        await tx.skills.update({ where: { id: existing.id }, data: { name } });
      }
      ids.push(existing.id);
    } else {
      const created = await tx.skills.create({ data: { name } });
      ids.push(created.id);
    }
  }
  return ids;
}

/**
 * Resolves title-cased industry names to Industries row ids, creating rows that
 * don't exist yet and re-casing existing rows that were saved with inconsistent casing.
 */
export async function resolveIndustryIds(tx: Prisma.TransactionClient, industryNames: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of industryNames) {
    const existing = await tx.industries.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
    if (existing) {
      if (existing.name !== name) {
        await tx.industries.update({ where: { id: existing.id }, data: { name } });
      }
      ids.push(existing.id);
    } else {
      const created = await tx.industries.create({ data: { name } });
      ids.push(created.id);
    }
  }
  return ids;
}

export interface ConsultantLanguageInput {
  name: string;
  fluency: FluencyLevel;
}

/**
 * Replaces a consultant's languages with the given list: resolves each language
 * name to a Languages row (creating/re-casing as needed), upserts the fluency,
 * and removes any ConsultantLanguage rows no longer present in the list.
 */
export async function syncConsultantLanguages(
  tx: Prisma.TransactionClient,
  consultantId: string,
  languages: ConsultantLanguageInput[]
) {
  const languageIds: string[] = [];

  for (const { name, fluency } of languages) {
    const existing = await tx.languages.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
    const languageId = existing
      ? existing.id
      : (await tx.languages.create({ data: { name } })).id;

    if (existing && existing.name !== name) {
      await tx.languages.update({ where: { id: existing.id }, data: { name } });
    }

    languageIds.push(languageId);
    await tx.consultantLanguage.upsert({
      where: { consultantId_languageId: { consultantId, languageId } },
      update: { fluency },
      create: { consultantId, languageId, fluency },
    });
  }

  await tx.consultantLanguage.deleteMany({
    where: { consultantId, languageId: { notIn: languageIds } },
  });
}
