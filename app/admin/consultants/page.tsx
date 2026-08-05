import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboardData";
import { Consultants } from "@/app/components/Consultants";

export default async function ConsultantsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getDashboardData(user.id);

  if (!data) {
    redirect("/");
  }

  return (
    <Consultants
      countries={data.countries}
      overalls={data.overalls}
      contractRenewals={data.contractRenewals}
      contractExpiration={data.contractExpiration} />
  );
}
