import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { TalentDashboard } from "@/app/components/talent/TalentDashboard";

export default async function TalentDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return <TalentDashboard talentName={user.name} />;
}
