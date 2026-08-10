import { prisma } from "@/lib/prisma";
import type { Prisma } from "../app/generated/prisma/client";
import { CLIENT_RATING_FIELDS, CONSULTANT_RATING_FIELDS, REVIEW_STATUS_LABELS, REVIEW_TYPE_LABELS } from "@/lib/performanceTypes";
import type { PerformanceReviewFormOptions, PerformanceReviewItem } from "@/lib/performanceTypes";

export { CLIENT_RATING_FIELDS, CONSULTANT_RATING_FIELDS, REVIEW_STATUS_LABELS, REVIEW_TYPE_LABELS };
export type { PerformanceReviewFormOptions, PerformanceReviewItem };
export type { ClientReviewStatus, ConsultantReviewStatus, ReviewStatus, ReviewType } from "@/lib/performanceTypes";

const performanceReviewInclude = {
    consultant: {
        select: {
            user: { select: { name: true, image: true } },
        },
    },
    client: { select: { name: true } },
    country: { select: { name: true } },
} as const;

type PerformanceReviewWithRelations = Prisma.PerformanceReviewGetPayload<{ include: typeof performanceReviewInclude }>;

function mapPerformanceReview(review: PerformanceReviewWithRelations): PerformanceReviewItem {
    return {
        id: review.id,
        reviewType: review.reviewType,
        reviewStatus: review.reviewStatus,
        clientStatus: review.clientStatus,
        consultantStatus: review.consultantStatus,
        consultantId: review.consultantId,
        consultantName: review.consultant.user.name,
        consultantPhoto: review.consultant.user.image,
        clientId: review.clientId,
        clientName: review.client.name,
        countryId: review.countryId,
        countryName: review.country.name,
        dueDate: review.dueDate.toISOString(),
        clientEmail: review.clientEmail,
        linkGenerate: review.linkGenerate,
        dateCreate: review.dateCreate.toISOString(),
        active: review.active,
        clientRating: review.clientRating,
        clientCompetencyRating: review.clientCompetencyRating,
        clientCommunicationRating: review.clientCommunicationRating,
        clientProblemSolvingRating: review.clientProblemSolvingRating,
        clientKeyStrengths: review.clientKeyStrengths,
        clientAreasForImprovement: review.clientAreasForImprovement,
        clientProjectFeedback: review.clientProjectFeedback,
        consultantSelfRating: review.consultantSelfRating,
        consultantSkillDevelopmentRating: review.consultantSkillDevelopmentRating,
        consultantTeamworkRating: review.consultantTeamworkRating,
        consultantGoalAchievementRating: review.consultantGoalAchievementRating,
        consultantKeyAchievements: review.consultantKeyAchievements,
        consultantChallengesFaced: review.consultantChallengesFaced,
        consultantFutureGoals: review.consultantFutureGoals,
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

async function getFormOptions(countryIds: string[]): Promise<PerformanceReviewFormOptions> {
    const [countries, clients, consultants] = await Promise.all([
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
        prisma.consultant.findMany({
            where: { active: true, countryId: { in: countryIds } },
            orderBy: { user: { name: "asc" } },
            select: {
                id: true,
                countryId: true,
                user: { select: { name: true, email: true } },
                job: { select: { name: true } },
            },
        }),
    ]);

    return {
        countries: countries.map((country) => ({ id: country.id, name: country.name, code: country.countryCode })),
        clients,
        consultants: consultants.map((consultant) => ({
            id: consultant.id,
            name: consultant.user.name,
            email: consultant.user.email,
            role: consultant.job.name,
            countryId: consultant.countryId,
        })),
    };
}

export async function getPerformanceReviewsData(userId: string) {
    const countryIds = await getAdminCountryIds(userId);
    if (!countryIds) {
        return null;
    }

    const [reviews, options] = await Promise.all([
        prisma.performanceReview.findMany({
            where: { countryId: { in: countryIds } },
            orderBy: { dueDate: "asc" },
            include: performanceReviewInclude,
        }),
        getFormOptions(countryIds),
    ]);

    return {
        reviews: reviews.map(mapPerformanceReview),
        options,
    };
}

export async function getPerformanceReviewDetailData(id: string, userId: string) {
    const countryIds = await getAdminCountryIds(userId);
    if (!countryIds) {
        return null;
    }

    const review = await prisma.performanceReview.findFirst({
        where: { id, countryId: { in: countryIds } },
        include: performanceReviewInclude,
    });
    if (!review) {
        return null;
    }

    const consultantReviews = await prisma.performanceReview.findMany({
        where: { consultantId: review.consultantId, countryId: { in: countryIds } },
        include: performanceReviewInclude,
    });

    return {
        review: mapPerformanceReview(review),
        consultantReviews: consultantReviews.map(mapPerformanceReview),
    };
}

export async function getPerformanceReviewItemById(id: string): Promise<PerformanceReviewItem | null> {
    const review = await prisma.performanceReview.findUnique({
        where: { id },
        include: performanceReviewInclude,
    });
    if (!review) {
        return null;
    }

    return mapPerformanceReview(review);
}
