import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboardData";
import { Dashboard } from "@/app/components/admin/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getDashboardData(user.id);

  if (!data) {
    redirect("/");
  }

  return (
    <Dashboard
      countries={data.countries}
      overalls={data.overalls}
      contractRenewals={data.contractRenewals}
      contractExpiration={data.contractExpiration}
    />
  );
}
