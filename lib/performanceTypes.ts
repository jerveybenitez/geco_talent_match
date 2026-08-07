import type { ClientReviewStatus, ConsultantReviewStatus, ReviewStatus, ReviewType } from "../app/generated/prisma/enums";

export type { ClientReviewStatus, ConsultantReviewStatus, ReviewStatus, ReviewType };

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
    quarterly: "Quarterly",
    semiannual: "Semi-Annual",
    annual: "Annual",
    monthly: "Monthly",
    probation: "Probation",
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
    inprogress: "In Progress",
    draft: "Draft",
    completed: "Completed",
    overdue: "Overdue",
};

export const CLIENT_RATING_FIELDS = [
    "clientRating",
    "clientCompetencyRating",
    "clientCommunicationRating",
    "clientProblemSolvingRating",
] as const;

export const CONSULTANT_RATING_FIELDS = [
    "consultantSelfRating",
    "consultantSkillDevelopmentRating",
    "consultantTeamworkRating",
    "consultantGoalAchievementRating",
] as const;

export interface PerformanceReviewItem {
    id: string;
    reviewType: ReviewType;
    reviewStatus: ReviewStatus;
    clientStatus: ClientReviewStatus;
    consultantStatus: ConsultantReviewStatus;
    consultantId: string;
    consultantName: string;
    consultantPhoto: string | null;
    clientId: string;
    clientName: string;
    countryId: string;
    countryName: string;
    dueDate: string;
    clientEmail: string;
    linkGenerate: string | null;
    dateCreate: string;
    active: boolean;

    clientRating: number | null;
    clientCompetencyRating: number | null;
    clientCommunicationRating: number | null;
    clientProblemSolvingRating: number | null;
    clientKeyStrengths: string | null;
    clientAreasForImprovement: string | null;
    clientProjectFeedback: string | null;

    consultantSelfRating: number | null;
    consultantSkillDevelopmentRating: number | null;
    consultantTeamworkRating: number | null;
    consultantGoalAchievementRating: number | null;
    consultantKeyAchievements: string | null;
    consultantChallengesFaced: string | null;
    consultantFutureGoals: string | null;
}

export interface PerformanceReviewFormOptions {
    countries: { id: string; name: string; code: string }[];
    clients: { id: string; name: string }[];
    consultants: { id: string; name: string; email: string; role: string; countryId: string }[];
}
