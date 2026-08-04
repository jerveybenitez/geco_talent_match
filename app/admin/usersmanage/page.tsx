import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { UsersManage } from "@/app/components/UsersManage";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <UsersManage
      userRole={user.role === "superadmin" ? "Super Admin" : user.role}
      userCountries={["ALL"]} />
  );

}