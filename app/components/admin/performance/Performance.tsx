"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Calendar, Search, Star } from "lucide-react";
import { PerformanceReviewFormDialog } from "./PerformanceReviewFormDialog";
import { reviewStatusBadgeVariant } from "./PerformanceReviewDetail";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {
  REVIEW_TYPE_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/performanceTypes";
import type {
  PerformanceReviewFormOptions,
  PerformanceReviewItem,
} from "@/lib/performanceTypes";

function isOverdue(review: PerformanceReviewItem) {
  return new Date(review.dueDate) < new Date() && review.reviewStatus !== "completed";
}

interface PerformanceProps {
  reviews: PerformanceReviewItem[];
  options: PerformanceReviewFormOptions;
}

export function Performance({ reviews: initialReviews, options }: PerformanceProps) {
  const [reviews, setReviews] = useState<PerformanceReviewItem[]>(initialReviews);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewTypeFilter, setReviewTypeFilter] = useState("all");

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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/performance/${review.id}`}>
                          {review.reviewStatus === 'completed' ? 'View' : 'Continue'}
                        </Link>
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
