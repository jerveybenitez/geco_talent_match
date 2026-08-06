import { prisma } from "@/lib/prisma";

export interface ClientRow {
    id: string;
    name: string;
    active: boolean;
    contractsCount: number;
}

export interface ContractTypeRow {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    contractsCount: number;
}

export interface CountryRow {
    id: string;
    name: string;
    countryCode: string;
    phone: string;
    active: boolean;
}

export interface LanguageRow {
    id: string;
    name: string;
    active: boolean;
}

export interface IndustryRow {
    id: string;
    name: string;
    active: boolean;
}

export interface SkillRow {
    id: string;
    name: string;
    active: boolean;
}

export interface JobRow {
    id: string;
    name: string;
    active: boolean;
}

export async function getConfigTablesData() {
    const [clients, contractTypes, countries, languages, industries, skills, jobs] = await Promise.all([
        prisma.client.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, active: true, _count: { select: { contracts: true } } },
        }),
        prisma.contractType.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, description: true, active: true, _count: { select: { contracts: true } } },
        }),
        prisma.country.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, countryCode: true, phone: true, active: true },
        }),
        prisma.languages.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, active: true },
        }),
        prisma.industries.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, active: true },
        }),
        prisma.skills.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, active: true },
        }),
        prisma.jobs.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, active: true },
        }),
    ]);

    return {
        clients: clients.map(({ _count, ...client }): ClientRow => ({ ...client, contractsCount: _count.contracts })),
        contractTypes: contractTypes.map(({ _count, ...contractType }): ContractTypeRow => ({
            ...contractType,
            contractsCount: _count.contracts,
        })),
        countries,
        languages,
        industries,
        skills,
        jobs,
    };
}
