import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getContractsData } from "@/lib/contractsData";
import { Contracts } from "@/app/components/admin/Contracts";

export default async function ContractsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getContractsData(user.id);

  if (!data) {
    redirect("/");
  }

  return <Contracts contracts={data.contracts} options={data.options} />;
}
