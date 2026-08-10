"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PerformanceReviewDetail } from "./PerformanceReviewDetail";
import type { PerformanceReviewItem } from "@/lib/performanceTypes";

interface PerformanceReviewDetailPageProps {
  review: PerformanceReviewItem;
  consultantReviews: PerformanceReviewItem[];
}

export function PerformanceReviewDetailPage({
  review: initialReview,
  consultantReviews: initialConsultantReviews,
}: PerformanceReviewDetailPageProps) {
  const router = useRouter();
  const [review, setReview] = useState(initialReview);
  const [consultantReviews, setConsultantReviews] = useState(initialConsultantReviews);

  const handleSaved = (updated: PerformanceReviewItem) => {
    setReview(updated);
    setConsultantReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <PerformanceReviewDetail
      review={review}
      consultantReviews={consultantReviews}
      onBack={() => router.push("/admin/performance")}
      onSaved={handleSaved}
    />
  );
}
