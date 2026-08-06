import { prisma } from "@/lib/prisma";

export async function getDashboardData(userid: string) {
    const user = await prisma.user.findUnique({
        where: { id: userid },
        include: { countriesHandled: true }
    });

    if (!user) {
        return null;
    }

    const countryIds = user.countriesHandled.map((country) => country.id);
    const consultants = await prisma.consultant.findMany({
        where: {
            active: true,
            user: {
                countriesHandled: {
                    some: { id: { in: countryIds } }
                }
            }
        },
        include: {
            user: { include: { countriesHandled: true } },
            contracts: { where: { active: true } }
        }
    });

    const countries = user.countriesHandled
        .filter((country) => country.active)
        .map((country) => ({
            country: country.name,
            countryId: country.id,
            code: country.countryCode,
            consultants: consultants.filter((consultant) =>
                consultant.user.countriesHandled.some((c) => c.id === country.id)
            )
        }))
        .sort((a, b) => b.consultants.length - a.consultants.length || a.country.localeCompare(b.country));

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const allActiveContracts = consultants.flatMap((consultant) => consultant.contracts);
    const overalls = {
        activeContracts: allActiveContracts.length,
        totalConsultants: consultants.length,
        expiringContracts: allActiveContracts.filter(
            (contract) => contract.contractendDate >= now && contract.contractendDate <= in30Days
        ).length
    };

    const contractRenewals = consultants
        .flatMap((consultant) =>
            consultant.contracts
                .filter((contract) => contract.contractendDate >= now && contract.contractendDate <= in30Days)
                .map((contract) => ({
                    contractId: contract.id,
                    consultantId: consultant.id,
                    consultantName: consultant.user.name,
                    endDate: contract.contractendDate
                }))
        )
        .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());

    const upcomingMonths = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString("en-US", { month: "short" }) };
    });

    const contractExpiration = upcomingMonths.map(({ year, month, label }) => ({
        month: label,
        count: allActiveContracts.filter(
            (contract) => contract.contractendDate.getFullYear() === year && contract.contractendDate.getMonth() === month
        ).length
    }));

    return { user, consultants, countries, overalls, contractRenewals, contractExpiration };
}
