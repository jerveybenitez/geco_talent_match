import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getContractListItemById, parseAllowances } from "@/lib/contractsData";

export async function POST(request: Request) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    positionName,
    consultantId,
    clientId,
    contractTypeId,
    countryId,
    city,
    monthlySalary,
    gecoJoinDate,
    deploymentDate,
    contractstartDate,
    contractendDate,
    renewalDate,
    deploymentNote,
    allowances,
  } = body as {
    positionName?: string;
    consultantId?: string;
    clientId?: string;
    contractTypeId?: string;
    countryId?: string;
    city?: string;
    monthlySalary?: number | string;
    gecoJoinDate?: string;
    deploymentDate?: string;
    contractstartDate?: string;
    contractendDate?: string;
    renewalDate?: string | null;
    deploymentNote?: string | null;
    allowances?: unknown;
  };

  if (!positionName) {
    return NextResponse.json({ error: "Position name is required" }, { status: 400 });
  }
  if (!consultantId || !clientId || !contractTypeId || !countryId || !city) {
    return NextResponse.json({ error: "Consultant, client, contract type, country and city are required" }, { status: 400 });
  }
  if (!monthlySalary || Number(monthlySalary) <= 0) {
    return NextResponse.json({ error: "Monthly salary must be greater than 0" }, { status: 400 });
  }
  if (!gecoJoinDate || !deploymentDate || !contractstartDate || !contractendDate) {
    return NextResponse.json({ error: "Joining, deployment, start and end dates are required" }, { status: 400 });
  }
  if (new Date(contractendDate) <= new Date(contractstartDate)) {
    return NextResponse.json({ error: "Contract end date must be after the start date" }, { status: 400 });
  }

  const [consultant, client] = await Promise.all([
    prisma.consultant.findUnique({ where: { id: consultantId }, select: { id: true } }),
    prisma.client.findUnique({ where: { id: clientId }, select: { id: true } }),
  ]);
  if (!consultant) {
    return NextResponse.json({ error: "Consultant not found" }, { status: 400 });
  }
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 400 });
  }

  const contract = await prisma.contract.create({
    data: {
      name: positionName,
      city,
      countryId,
      consultantId,
      clientId,
      contractTypeId,
      monthlySalary: Number(monthlySalary),
      gecoJoinDate: new Date(gecoJoinDate),
      deploymentDate: new Date(deploymentDate),
      contractstartDate: new Date(contractstartDate),
      contractendDate: new Date(contractendDate),
      renewalDate: renewalDate ? new Date(renewalDate) : null,
      deploymentNote: deploymentNote || null,
      allowances: { create: parseAllowances(allowances) },
    },
    select: { id: true },
  });

  const created = await getContractListItemById(contract.id);
  return NextResponse.json(created, { status: 201 });
}
