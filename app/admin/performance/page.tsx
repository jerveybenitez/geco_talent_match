import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboardData";
import { Performance } from "@/app/components/admin/performance/Performance";

export default async function PerformancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getDashboardData(user.id);

  if (!data) {
    redirect("/");
  }

  return (
    <Performance
      countries={data.countries}
      overalls={data.overalls}
      contractRenewals={data.contractRenewals}
      contractExpiration={data.contractExpiration}
    />
  );
}
