import { prisma } from "@/lib/prisma";

export async function getUsersManageData() {
    const [users, countries] = await Promise.all([
        prisma.user.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                active: true,
                image: true,
                countriesHandled: {
                    select: { id: true, name: true, countryCode: true }
                },
                sessions: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { createdAt: true }
                }
            }
        }),
        prisma.country.findMany({
            where: { active: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, countryCode: true }
        })
    ]);

    return {
        users: users.map(({ sessions, ...user }) => ({
            ...user,
            lastLogin: sessions[0]?.createdAt ?? null
        })),
        countries
    };
}
