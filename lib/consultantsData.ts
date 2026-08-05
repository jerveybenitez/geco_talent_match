import { prisma } from "@/lib/prisma";

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

export async function getConsultantsData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { countriesHandled: true },
  });

  if (!user) {
    return null;
  }

  const countryIds = user.countriesHandled.map((country) => country.id);

  const consultants = await prisma.consultant.findMany({
    where: {
      active: true,
      countryId: { in: countryIds },
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
        orderBy: { endDate: "asc" },
        take: 1,
        select: { endDate: true },
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
    contractExpiry: (consultant.contracts[0]?.endDate ?? consultant.availableTo).toISOString(),
  }));

  const countries = user.countriesHandled.map((country) => ({
    id: country.id,
    name: country.name,
    code: country.countryCode,
  }));

  return { consultants: consultantList, countries };
}
