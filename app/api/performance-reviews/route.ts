import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPerformanceReviewItemById } from "@/lib/performanceData";
import { ReviewType } from "../../generated/prisma/client";

export async function POST(request: Request) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { reviewType, consultantId, clientId, countryId, dueDate, clientEmail } = body as {
    reviewType?: string;
    consultantId?: string;
    clientId?: string;
    countryId?: string;
    dueDate?: string;
    clientEmail?: string;
  };

  if (!reviewType || !Object.values(ReviewType).includes(reviewType as ReviewType)) {
    return NextResponse.json({ error: "A valid review type is required" }, { status: 400 });
  }
  if (!consultantId || !clientId || !countryId) {
    return NextResponse.json({ error: "Consultant, client and country are required" }, { status: 400 });
  }
  if (!dueDate) {
    return NextResponse.json({ error: "Due date is required" }, { status: 400 });
  }
  if (!clientEmail) {
    return NextResponse.json({ error: "Client/manager email is required" }, { status: 400 });
  }

  const [consultant, client, country] = await Promise.all([
    prisma.consultant.findUnique({ where: { id: consultantId }, select: { id: true } }),
    prisma.client.findUnique({ where: { id: clientId }, select: { id: true } }),
    prisma.country.findUnique({ where: { id: countryId }, select: { id: true } }),
  ]);
  if (!consultant) {
    return NextResponse.json({ error: "Consultant not found" }, { status: 400 });
  }
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 400 });
  }
  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 400 });
  }

  const review = await prisma.performanceReview.create({
    data: {
      reviewType: reviewType as ReviewType,
      consultantId,
      clientId,
      countryId,
      dueDate: new Date(dueDate),
      clientEmail,
      createdById: sessionUser.id,
    },
    select: { id: true },
  });

  const created = await getPerformanceReviewItemById(review.id);
  return NextResponse.json(created, { status: 201 });
}
