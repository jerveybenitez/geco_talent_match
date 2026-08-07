import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPerformanceReviewsData } from "@/lib/performanceData";
import { Performance } from "@/app/components/admin/performance/Performance";

export default async function PerformancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getPerformanceReviewsData(user.id);

  if (!data) {
    redirect("/");
  }

  return <Performance reviews={data.reviews} options={data.options} />;
}
