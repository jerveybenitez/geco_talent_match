"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Slider } from "../../ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Calendar, ArrowLeft, Send, FileSignature, Star, Search } from "lucide-react";
import { PerformanceReviewFormDialog } from "./PerformanceReviewFormDialog";
import { PerformanceReviewSuccessModal } from "./PerformanceReviewSuccessModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {
  REVIEW_TYPE_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/performanceTypes";
import type {
  PerformanceReviewFormOptions,
  PerformanceReviewItem,
  ReviewStatus,
} from "@/lib/performanceTypes";

const reviewStatusBadgeVariant: Record<ReviewStatus, "default" | "secondary" | "outline"> = {
  inprogress: "outline",
  draft: "secondary",
  completed: "default",
  overdue: "outline",
};

const MAX_TREND_QUARTERS = 6;

function buildPerformanceTrend(consultantReviews: PerformanceReviewItem[]) {
  const buckets = new Map<string, { year: number; quarter: number; scores: number[] }>();

  consultantReviews
    .filter((review) => review.reviewStatus === "completed")
    .forEach((review) => {
      const dueDate = new Date(review.dueDate);
      const year = dueDate.getFullYear();
      const quarter = Math.floor(dueDate.getMonth() / 3) + 1;
      const ratings = [review.clientRating, review.consultantSelfRating].filter(
        (rating): rating is number => rating != null,
      );
      if (ratings.length === 0) return;
      const score = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

      const key = `${year}-Q${quarter}`;
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.scores.push(score);
      } else {
        buckets.set(key, { year, quarter, scores: [score] });
      }
    });

  const sortedQuarters = Array.from(buckets.values()).sort(
    (a, b) => a.year - b.year || a.quarter - b.quarter,
  );
  const mostRecentQuarters = sortedQuarters.slice(-MAX_TREND_QUARTERS);

  if (mostRecentQuarters.length > 0 && mostRecentQuarters.length <= 5) {
    const earliest = mostRecentQuarters[0];
    const prevQuarter = earliest.quarter === 1 ? 4 : earliest.quarter - 1;
    const prevYear = earliest.quarter === 1 ? earliest.year - 1 : earliest.year;
    mostRecentQuarters.unshift({ year: prevYear, quarter: prevQuarter, scores: [0] });
  }

  return mostRecentQuarters.map(({ year, quarter, scores }) => ({
    period: `Q${quarter} ${year}`,
    score: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10,
  }));
}

interface RatingFormState {
  clientRating: number;
  clientCompetencyRating: number;
  clientCommunicationRating: number;
  clientProblemSolvingRating: number;
  clientKeyStrengths: string;
  clientAreasForImprovement: string;
  clientProjectFeedback: string;
  consultantSelfRating: number;
  consultantSkillDevelopmentRating: number;
  consultantTeamworkRating: number;
  consultantGoalAchievementRating: number;
  consultantKeyAchievements: string;
  consultantChallengesFaced: string;
  consultantFutureGoals: string;
}

function toFormState(review: PerformanceReviewItem): RatingFormState {
  return {
    clientRating: review.clientRating ?? 3,
    clientCompetencyRating: review.clientCompetencyRating ?? 3,
    clientCommunicationRating: review.clientCommunicationRating ?? 3,
    clientProblemSolvingRating: review.clientProblemSolvingRating ?? 3,
    clientKeyStrengths: review.clientKeyStrengths ?? "",
    clientAreasForImprovement: review.clientAreasForImprovement ?? "",
    clientProjectFeedback: review.clientProjectFeedback ?? "",
    consultantSelfRating: review.consultantSelfRating ?? 3,
    consultantSkillDevelopmentRating: review.consultantSkillDevelopmentRating ?? 3,
    consultantTeamworkRating: review.consultantTeamworkRating ?? 3,
    consultantGoalAchievementRating: review.consultantGoalAchievementRating ?? 3,
    consultantKeyAchievements: review.consultantKeyAchievements ?? "",
    consultantChallengesFaced: review.consultantChallengesFaced ?? "",
    consultantFutureGoals: review.consultantFutureGoals ?? "",
  };
}

function isOverdue(review: PerformanceReviewItem) {
  return new Date(review.dueDate) < new Date() && review.reviewStatus !== "completed";
}

function average(a: number, b: number, c: number) {
  return Math.round(((a + b + c) / 3) * 10) / 10;
}

interface PerformanceReviewDetailProps {
  review: PerformanceReviewItem;
  consultantReviews: PerformanceReviewItem[];
  onBack: () => void;
  onSaved: (review: PerformanceReviewItem) => void;
}

function PerformanceReviewDetail({ review, consultantReviews, onBack, onSaved }: PerformanceReviewDetailProps) {
  const [form, setForm] = useState<RatingFormState>(() => toFormState(review));
  const [saving, setSaving] = useState(false);
  const performanceHistoryData = buildPerformanceTrend(consultantReviews);
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);
  const readOnly = review.reviewStatus === "completed";

  const updateClientSubRating = (
    field: "clientCompetencyRating" | "clientCommunicationRating" | "clientProblemSolvingRating",
    value: number,
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      return {
        ...next,
        clientRating: average(next.clientCompetencyRating, next.clientCommunicationRating, next.clientProblemSolvingRating),
      };
    });
  };

  const updateConsultantSubRating = (
    field: "consultantSkillDevelopmentRating" | "consultantTeamworkRating" | "consultantGoalAchievementRating",
    value: number,
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      return {
        ...next,
        consultantSelfRating: average(
          next.consultantSkillDevelopmentRating,
          next.consultantTeamworkRating,
          next.consultantGoalAchievementRating,
        ),
      };
    });
  };

  const handleSave = async (nextStatus: "draft" | "completed") => {
    setSaving(true);
    try {
      const res = await fetch(`/api/performance-reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus: nextStatus, ...form }),
      });
      if (!res.ok) return;
      const updated = (await res.json()) as PerformanceReviewItem;
      onSaved(updated);
      if (nextStatus === "draft") {
        setShowDraftSuccess(true);
        setTimeout(() => setShowDraftSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reviews
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{review.consultantName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {REVIEW_TYPE_LABELS[review.reviewType]} Review • {review.clientName} • Due{" "}
                {new Date(review.dueDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={reviewStatusBadgeVariant[review.reviewStatus]}>
              {REVIEW_STATUS_LABELS[review.reviewStatus]}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Dual-Sided Evaluation Form */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client/Manager Feedback</CardTitle>
            {!readOnly && (
              <Button variant="outline" size="sm" className="mt-2">
                <Send className="mr-2 h-4 w-4" />
                Send Reminder to Client
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Overall Performance Rating</Label>
              <div className="mt-2">
                <Slider
                  value={[form.clientRating]}
                  onValueChange={(val) => setForm({ ...form, clientRating: val[0] })}
                  max={5}
                  step={0.1}
                  disabled={readOnly}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">1.0</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{form.clientRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">5.0</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="client-strengths">Key Strengths</Label>
              <Textarea
                id="client-strengths"
                placeholder="What did the consultant do exceptionally well?"
                className="mt-2 min-h-[100px]"
                value={form.clientKeyStrengths}
                onChange={(e) => setForm({ ...form, clientKeyStrengths: e.target.value })}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="client-improvements">Areas for Improvement</Label>
              <Textarea
                id="client-improvements"
                placeholder="What could be improved or developed further?"
                className="mt-2 min-h-[100px]"
                value={form.clientAreasForImprovement}
                onChange={(e) => setForm({ ...form, clientAreasForImprovement: e.target.value })}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label>Technical Competency</Label>
              <Slider
                value={[form.clientCompetencyRating]}
                onValueChange={(val) => updateClientSubRating("clientCompetencyRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Improvement</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label>Communication Skills</Label>
              <Slider
                value={[form.clientCommunicationRating]}
                onValueChange={(val) => updateClientSubRating("clientCommunicationRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Improvement</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label>Problem Solving</Label>
              <Slider
                value={[form.clientProblemSolvingRating]}
                onValueChange={(val) => updateClientSubRating("clientProblemSolvingRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Improvement</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <Label htmlFor="client-specific">Project-Specific Feedback</Label>
              <Textarea
                id="client-specific"
                placeholder="Feedback on specific projects or deliverables..."
                className="mt-2 min-h-[80px]"
                value={form.clientProjectFeedback}
                onChange={(e) => setForm({ ...form, clientProjectFeedback: e.target.value })}
                disabled={readOnly}
              />
            </div>

            {readOnly && (
              <Badge variant="default" className="w-full justify-center py-2">
                Client Feedback Received
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Consultant Self-Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultant Self-Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Self-Rating</Label>
              <div className="mt-2">
                <Slider
                  value={[form.consultantSelfRating]}
                  onValueChange={(val) => setForm({ ...form, consultantSelfRating: val[0] })}
                  max={5}
                  step={0.1}
                  disabled={readOnly}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">1.0</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-blue-400 text-blue-400" />
                    <span className="text-2xl font-bold">{form.consultantSelfRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">5.0</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="consultant-achievements">Key Achievements</Label>
              <Textarea
                id="consultant-achievements"
                placeholder="What are you most proud of this period?"
                className="mt-2 min-h-[100px]"
                value={form.consultantKeyAchievements}
                onChange={(e) => setForm({ ...form, consultantKeyAchievements: e.target.value })}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="consultant-challenges">Challenges Faced</Label>
              <Textarea
                id="consultant-challenges"
                placeholder="What obstacles did you encounter?"
                className="mt-2 min-h-[100px]"
                value={form.consultantChallengesFaced}
                onChange={(e) => setForm({ ...form, consultantChallengesFaced: e.target.value })}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label>Technical Skills Development</Label>
              <Slider
                value={[form.consultantSkillDevelopmentRating]}
                onValueChange={(val) => updateConsultantSubRating("consultantSkillDevelopmentRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Focus</span>
                <span>Strong Growth</span>
              </div>
            </div>

            <div>
              <Label>Collaboration & Teamwork</Label>
              <Slider
                value={[form.consultantTeamworkRating]}
                onValueChange={(val) => updateConsultantSubRating("consultantTeamworkRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Focus</span>
                <span>Strong Growth</span>
              </div>
            </div>

            <div>
              <Label>Goal Achievement</Label>
              <Slider
                value={[form.consultantGoalAchievementRating]}
                onValueChange={(val) => updateConsultantSubRating("consultantGoalAchievementRating", val[0])}
                max={5}
                step={0.1}
                className="mt-2"
                disabled={readOnly}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Needs Focus</span>
                <span>Strong Growth</span>
              </div>
            </div>

            <div>
              <Label htmlFor="consultant-goals">Development Goals & Career Aspirations</Label>
              <Textarea
                id="consultant-goals"
                placeholder="What skills or roles would you like to develop?"
                className="mt-2 min-h-[80px]"
                value={form.consultantFutureGoals}
                onChange={(e) => setForm({ ...form, consultantFutureGoals: e.target.value })}
                disabled={readOnly}
              />
            </div>

            {readOnly && (
              <Badge variant="default" className="w-full justify-center py-2">
                Self-Assessment Received
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {readOnly ? 'Review completed and archived' : 'Complete both sections to finalize the review'}
            </div>
            <div className="flex gap-2">
              {!readOnly && (
                <>
                  <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
                    Save Draft
                  </Button>
                  <Button variant="outline">
                    <FileSignature className="mr-2 h-4 w-4" />
                    Generate Summary Report
                  </Button>
                  <Button onClick={() => handleSave("completed")} disabled={saving}>
                    Submit
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance History */}
      {readOnly && performanceHistoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Performance Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <PerformanceReviewSuccessModal open={showDraftSuccess} onOpenChange={setShowDraftSuccess} />
    </div>
  );
}

interface PerformanceProps {
  reviews: PerformanceReviewItem[];
  options: PerformanceReviewFormOptions;
}

export function Performance({ reviews: initialReviews, options }: PerformanceProps) {
  const [reviews, setReviews] = useState<PerformanceReviewItem[]>(initialReviews);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewTypeFilter, setReviewTypeFilter] = useState("all");

  const selectedReview = reviews.find((review) => review.id === selectedReviewId) ?? null;

  const filteredReviews = reviews.filter((review) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      review.consultantName.toLowerCase().includes(term) ||
      review.clientName.toLowerCase().includes(term);
    const matchesReviewType = reviewTypeFilter === "all" || review.reviewType === reviewTypeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "overdue" ? isOverdue(review) : review.reviewStatus === statusFilter);
    return matchesSearch && matchesReviewType && matchesStatus;
  });

  const handleCreated = (review: PerformanceReviewItem) => {
    setReviews((prev) => [review, ...prev]);
  };

  const handleReviewSaved = (updated: PerformanceReviewItem) => {
    setReviews((prev) => prev.map((review) => (review.id === updated.id ? updated : review)));
  };

  if (selectedReview) {
    return (
      <PerformanceReviewDetail
        key={selectedReview.id}
        review={selectedReview}
        consultantReviews={reviews.filter((r) => r.consultantId === selectedReview.consultantId)}
        onBack={() => setSelectedReviewId(null)}
        onSaved={handleReviewSaved}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Performance Reviews</h2>
        <Button onClick={() => setShowCreateReview(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Create New Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Consultant or client..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="review-type-filter">Review Type</Label>
              <Select value={reviewTypeFilter} onValueChange={setReviewTypeFilter}>
                <SelectTrigger id="review-type-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(REVIEW_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Review Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client Rating</TableHead>
                <TableHead>Self Rating</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => {
                const overdue = isOverdue(review);
                return (
                  <TableRow key={review.id} className={overdue ? 'bg-orange-50' : ''}>
                    <TableCell className="font-medium">{review.consultantName}</TableCell>
                    <TableCell>{review.clientName}</TableCell>
                    <TableCell>{REVIEW_TYPE_LABELS[review.reviewType]}</TableCell>
                    <TableCell>
                      {new Date(review.dueDate).toLocaleDateString()}
                      {overdue && (
                        <Badge className="ml-2 text-xs bg-orange-500 text-white hover:bg-orange-500">
                          Overdue
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={reviewStatusBadgeVariant[review.reviewStatus]}>
                        {REVIEW_STATUS_LABELS[review.reviewStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.clientRating != null ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{review.clientRating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {review.consultantSelfRating != null ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                          <span>{review.consultantSelfRating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReviewId(review.id)}
                      >
                        {review.reviewStatus === 'completed' ? 'View' : 'Continue'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No performance reviews found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Review Dialog */}
      <PerformanceReviewFormDialog
        open={showCreateReview}
        onOpenChange={setShowCreateReview}
        options={options}
        onCreated={handleCreated}
      />
    </div>
  );
}
