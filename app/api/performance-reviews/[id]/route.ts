import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPerformanceReviewItemById, CLIENT_RATING_FIELDS, CONSULTANT_RATING_FIELDS } from "@/lib/performanceData";
import { ReviewStatus } from "../../../generated/prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionUser.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.performanceReview.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Performance review not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    dueDate,
    clientEmail,
    linkGenerate,
    active,
    reviewStatus,
    clientRating,
    clientCompetencyRating,
    clientCommunicationRating,
    clientProblemSolvingRating,
    clientKeyStrengths,
    clientAreasForImprovement,
    clientProjectFeedback,
    consultantSelfRating,
    consultantSkillDevelopmentRating,
    consultantTeamworkRating,
    consultantGoalAchievementRating,
    consultantKeyAchievements,
    consultantChallengesFaced,
    consultantFutureGoals,
  } = body as {
    dueDate?: string;
    clientEmail?: string;
    linkGenerate?: string | null;
    active?: boolean;
    reviewStatus?: string;
    clientRating?: number | null;
    clientCompetencyRating?: number | null;
    clientCommunicationRating?: number | null;
    clientProblemSolvingRating?: number | null;
    clientKeyStrengths?: string | null;
    clientAreasForImprovement?: string | null;
    clientProjectFeedback?: string | null;
    consultantSelfRating?: number | null;
    consultantSkillDevelopmentRating?: number | null;
    consultantTeamworkRating?: number | null;
    consultantGoalAchievementRating?: number | null;
    consultantKeyAchievements?: string | null;
    consultantChallengesFaced?: string | null;
    consultantFutureGoals?: string | null;
  };

  if (reviewStatus !== undefined && !Object.values(ReviewStatus).includes(reviewStatus as ReviewStatus)) {
    return NextResponse.json({ error: "Invalid review status" }, { status: 400 });
  }

  const finalValues = {
    ...existing,
    ...(clientRating !== undefined && { clientRating }),
    ...(clientCompetencyRating !== undefined && { clientCompetencyRating }),
    ...(clientCommunicationRating !== undefined && { clientCommunicationRating }),
    ...(clientProblemSolvingRating !== undefined && { clientProblemSolvingRating }),
    ...(consultantSelfRating !== undefined && { consultantSelfRating }),
    ...(consultantSkillDevelopmentRating !== undefined && { consultantSkillDevelopmentRating }),
    ...(consultantTeamworkRating !== undefined && { consultantTeamworkRating }),
    ...(consultantGoalAchievementRating !== undefined && { consultantGoalAchievementRating }),
  };

  const finalReviewStatus = (reviewStatus as ReviewStatus | undefined) ?? existing.reviewStatus;

  let clientStatus = existing.clientStatus;
  let consultantStatus = existing.consultantStatus;
  if (finalReviewStatus === ReviewStatus.draft) {
    clientStatus = CLIENT_RATING_FIELDS.every((field) => finalValues[field] !== null) ? "replied" : "pending";
    consultantStatus = CONSULTANT_RATING_FIELDS.every((field) => finalValues[field] !== null) ? "replied" : "pending";
  }

  await prisma.performanceReview.update({
    where: { id },
    data: {
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(linkGenerate !== undefined && { linkGenerate }),
      ...(active !== undefined && { active }),
      ...(reviewStatus !== undefined && { reviewStatus: reviewStatus as ReviewStatus }),
      clientStatus,
      consultantStatus,
      ...(clientRating !== undefined && { clientRating }),
      ...(clientCompetencyRating !== undefined && { clientCompetencyRating }),
      ...(clientCommunicationRating !== undefined && { clientCommunicationRating }),
      ...(clientProblemSolvingRating !== undefined && { clientProblemSolvingRating }),
      ...(clientKeyStrengths !== undefined && { clientKeyStrengths }),
      ...(clientAreasForImprovement !== undefined && { clientAreasForImprovement }),
      ...(clientProjectFeedback !== undefined && { clientProjectFeedback }),
      ...(consultantSelfRating !== undefined && { consultantSelfRating }),
      ...(consultantSkillDevelopmentRating !== undefined && { consultantSkillDevelopmentRating }),
      ...(consultantTeamworkRating !== undefined && { consultantTeamworkRating }),
      ...(consultantGoalAchievementRating !== undefined && { consultantGoalAchievementRating }),
      ...(consultantKeyAchievements !== undefined && { consultantKeyAchievements }),
      ...(consultantChallengesFaced !== undefined && { consultantChallengesFaced }),
      ...(consultantFutureGoals !== undefined && { consultantFutureGoals }),
    },
  });

  const updated = await getPerformanceReviewItemById(id);
  return NextResponse.json(updated);
}
