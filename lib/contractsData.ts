import { prisma } from "@/lib/prisma";
import type { Prisma } from "../app/generated/prisma/client";

export type ContractStatus = "Active" | "Pending Renewal" | "Expired" | "Inactive";

const ALLOWANCE_FREQUENCIES = ["monthly", "quarterly", "yearly"] as const;

interface AllowanceInput {
    name?: unknown;
    amountUsd?: unknown;
    frequency?: unknown;
}

export function parseAllowances(allowances: unknown) {
    if (!Array.isArray(allowances)) return [];

    return allowances
        .filter((allowance): allowance is AllowanceInput & { name: string } =>
            !!allowance && typeof allowance === "object" && typeof (allowance as AllowanceInput).name === "string" && (allowance as { name: string }).name.trim() !== ""
        )
        .map((allowance) => ({
            name: allowance.name.trim(),
            amountUsd: Number(allowance.amountUsd) || 0,
            frequency: ALLOWANCE_FREQUENCIES.includes(allowance.frequency as (typeof ALLOWANCE_FREQUENCIES)[number])
                ? (allowance.frequency as (typeof ALLOWANCE_FREQUENCIES)[number])
                : "monthly",
        }));
}

export interface ContractAllowanceItem {
    id: string;
    name: string;
    amountUsd: number;
    frequency: "monthly" | "quarterly" | "yearly";
}

export interface ContractListItem {
    id: string;
    consultantId: string;
    consultantName: string;
    consultantPhoto: string | null;
    jobRole: string;
    clientId: string;
    client: string;
    contractTypeId: string;
    contractType: string;
    countryId: string;
    country: string;
    city: string;
    monthlySalary: number;
    gecoJoinDate: string;
    deploymentDate: string;
    contractstartDate: string;
    contractendDate: string;
    renewalDate: string | null;
    deploymentNote: string | null;
    active: boolean;
    status: ContractStatus;
    allowances: ContractAllowanceItem[];
}

export interface ContractDetail extends ContractListItem {
    consultantEmail: string;
    consultantPhone: string | null;
    history: ContractListItem[];
}

export interface ContractFormOptions {
    countries: { id: string; name: string; code: string }[];
    clients: { id: string; name: string }[];
    contractTypes: { id: string; name: string }[];
    consultants: { id: string; name: string; role: string }[];
}

const contractInclude = {
    consultant: {
        select: {
            user: { select: { name: true, email: true, phone: true, image: true } },
            job: { select: { name: true } },
        },
    },
    client: { select: { name: true } },
    contractType: { select: { name: true } },
    country: { select: { name: true } },
    allowances: {
        where: { active: true },
        select: { id: true, name: true, amountUsd: true, frequency: true },
    },
} as const;

type ContractWithRelations = Prisma.ContractGetPayload<{ include: typeof contractInclude }>;

function deriveStatus(active: boolean, contractendDate: Date): ContractStatus {
    if (!active) return "Inactive";

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (contractendDate < now) return "Expired";
    if (contractendDate <= in30Days) return "Pending Renewal";
    return "Active";
}

function mapContract(contract: ContractWithRelations): ContractListItem {
    return {
        id: contract.id,
        consultantId: contract.consultantId,
        consultantName: contract.consultant.user.name,
        consultantPhoto: contract.consultant.user.image,
        jobRole: contract.consultant.job.name,
        clientId: contract.clientId,
        client: contract.client.name,
        contractTypeId: contract.contractTypeId,
        contractType: contract.contractType.name,
        countryId: contract.countryId,
        country: contract.country.name,
        city: contract.city,
        monthlySalary: contract.monthlySalary,
        gecoJoinDate: contract.gecoJoinDate.toISOString(),
        deploymentDate: contract.deploymentDate.toISOString(),
        contractstartDate: contract.contractstartDate.toISOString(),
        contractendDate: contract.contractendDate.toISOString(),
        renewalDate: contract.renewalDate ? contract.renewalDate.toISOString() : null,
        deploymentNote: contract.deploymentNote,
        active: contract.active,
        status: deriveStatus(contract.active, contract.contractendDate),
        allowances: contract.allowances,
    };
}

async function getAdminCountryIds(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { countriesHandled: true },
    });

    if (!user) {
        return null;
    }

    return user.countriesHandled.map((country) => country.id);
}

async function getFormOptions(countryIds: string[]): Promise<ContractFormOptions> {
    const [countries, clients, contractTypes, consultants] = await Promise.all([
        prisma.country.findMany({
            where: { id: { in: countryIds }, active: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, countryCode: true },
        }),
        prisma.client.findMany({
            where: { active: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
        prisma.contractType.findMany({
            where: { active: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
        prisma.consultant.findMany({
            where: { active: true, countryId: { in: countryIds } },
            orderBy: { user: { name: "asc" } },
            select: { id: true, user: { select: { name: true } }, job: { select: { name: true } } },
        }),
    ]);

    return {
        countries: countries.map((country) => ({ id: country.id, name: country.name, code: country.countryCode })),
        clients,
        contractTypes,
        consultants: consultants.map((consultant) => ({
            id: consultant.id,
            name: consultant.user.name,
            role: consultant.job.name,
        })),
    };
}

export async function getContractsData(userId: string) {
    const countryIds = await getAdminCountryIds(userId);
    if (!countryIds) {
        return null;
    }

    const [contracts, options] = await Promise.all([
        prisma.contract.findMany({
            where: { countryId: { in: countryIds } },
            orderBy: { contractstartDate: "desc" },
            include: contractInclude,
        }),
        getFormOptions(countryIds),
    ]);

    return {
        contracts: contracts.map(mapContract),
        options,
    };
}

export async function getContractById(id: string, userId: string) {
    const countryIds = await getAdminCountryIds(userId);
    if (!countryIds) {
        return null;
    }

    const contract = await prisma.contract.findFirst({
        where: { id, countryId: { in: countryIds } },
        include: contractInclude,
    });
    if (!contract) {
        return null;
    }

    const [history, options] = await Promise.all([
        prisma.contract.findMany({
            where: { consultantId: contract.consultantId, id: { not: contract.id } },
            orderBy: { contractstartDate: "desc" },
            include: contractInclude,
        }),
        getFormOptions(countryIds),
    ]);

    const contractDetail: ContractDetail = {
        ...mapContract(contract),
        consultantEmail: contract.consultant.user.email,
        consultantPhone: contract.consultant.user.phone,
        history: history.map(mapContract),
    };

    return { contract: contractDetail, options };
}

export async function getContractsForConsultant(consultantId: string): Promise<ContractListItem[]> {
    const contracts = await prisma.contract.findMany({
        where: { consultantId },
        orderBy: { contractstartDate: "desc" },
        include: contractInclude,
    });

    return contracts.map(mapContract);
}

export async function getContractListItemById(id: string): Promise<ContractListItem | null> {
    const contract = await prisma.contract.findUnique({
        where: { id },
        include: contractInclude,
    });
    if (!contract) {
        return null;
    }

    return mapContract(contract);
}
