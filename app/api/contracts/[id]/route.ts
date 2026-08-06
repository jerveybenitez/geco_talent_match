import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getContractListItemById, parseAllowances } from "@/lib/contractsData";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.contract.findUnique({
    where: { id },
    select: { consultantId: true, clientId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
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
    active,
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
    active?: boolean;
    allowances?: unknown;
  };

  if (positionName !== undefined && !positionName) {
    return NextResponse.json({ error: "Position name is required" }, { status: 400 });
  }
  if (monthlySalary !== undefined && Number(monthlySalary) <= 0) {
    return NextResponse.json({ error: "Monthly salary must be greater than 0" }, { status: 400 });
  }
  if (contractstartDate !== undefined && contractendDate !== undefined
    && new Date(contractendDate) <= new Date(contractstartDate)) {
    return NextResponse.json({ error: "Contract end date must be after the start date" }, { status: 400 });
  }

  if (consultantId !== undefined || clientId !== undefined) {
    const [consultant, client] = await Promise.all([
      prisma.consultant.findUnique({ where: { id: consultantId ?? existing.consultantId }, select: { id: true } }),
      prisma.client.findUnique({ where: { id: clientId ?? existing.clientId }, select: { id: true } }),
    ]);
    if (!consultant) {
      return NextResponse.json({ error: "Consultant not found" }, { status: 400 });
    }
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.contract.update({
      where: { id },
      data: {
        ...(positionName !== undefined && { name: positionName }),
        ...(consultantId !== undefined && { consultantId }),
        ...(clientId !== undefined && { clientId }),
        ...(contractTypeId !== undefined && { contractTypeId }),
        ...(countryId !== undefined && { countryId }),
        ...(city !== undefined && { city }),
        ...(monthlySalary !== undefined && { monthlySalary: Number(monthlySalary) }),
        ...(gecoJoinDate !== undefined && { gecoJoinDate: new Date(gecoJoinDate) }),
        ...(deploymentDate !== undefined && { deploymentDate: new Date(deploymentDate) }),
        ...(contractstartDate !== undefined && { contractstartDate: new Date(contractstartDate) }),
        ...(contractendDate !== undefined && { contractendDate: new Date(contractendDate) }),
        ...(renewalDate !== undefined && { renewalDate: renewalDate ? new Date(renewalDate) : null }),
        ...(deploymentNote !== undefined && { deploymentNote: deploymentNote || null }),
        ...(active !== undefined && { active }),
      },
    });

    if (allowances !== undefined) {
      await tx.contractAllowance.deleteMany({ where: { contractId: id } });
      const parsed = parseAllowances(allowances);
      if (parsed.length > 0) {
        await tx.contractAllowance.createMany({
          data: parsed.map((allowance) => ({ ...allowance, contractId: id })),
        });
      }
    }
  });

  const updated = await getContractListItemById(id);
  return NextResponse.json(updated);
}
