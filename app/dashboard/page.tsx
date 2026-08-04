import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Dashboard } from "@/app/components/Dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <Dashboard
      userRole={user.role === "superadmin" ? "Super Admin" : user.role}
      userCountries={["ALL"]} />
  );
}