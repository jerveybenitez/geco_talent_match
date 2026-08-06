import { prisma } from "@/lib/prisma";

export type Role = "superadmin" | "admin" | "user";

export interface Country {
    id: string;
    name: string;
    countryCode: string;
}

export interface ManagedUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    active: boolean;
    image: string | null;
    countriesHandled: Country[];
    lastLogin: string | Date | null;
}

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
