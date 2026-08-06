import { prisma } from "@/lib/prisma";
import { getContractsForConsultant, type ContractListItem } from "@/lib/contractsData";

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
  };

  return { consultant: consultantData, countries: admin.countries };
}
