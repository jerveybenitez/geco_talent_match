import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUsersManageData } from "@/lib/usersManageData";
import { UsersManage } from "@/app/components/UsersManage";

export default async function UsersManagePage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/");
  }

  const { users, countries } = await getUsersManageData();

  return <UsersManage users={users} countries={countries} />;
}
