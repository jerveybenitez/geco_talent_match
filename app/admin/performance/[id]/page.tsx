import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPerformanceReviewDetailData } from "@/lib/performanceData";
import { PerformanceReviewDetailPage } from "@/app/components/admin/performance/PerformanceReviewDetailPage";

export default async function PerformanceReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const result = await getPerformanceReviewDetailData(id, user.id);

  if (!result) {
    notFound();
  }

  return (
    <PerformanceReviewDetailPage review={result.review} consultantReviews={result.consultantReviews} />
  );
}
