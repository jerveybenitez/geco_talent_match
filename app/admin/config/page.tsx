import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConfigTablesData } from "@/lib/configTablesData";
import { ConfigTables } from "@/app/components/admin/ConfigTables";

export default async function ConfigPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/");
  }

  const data = await getConfigTablesData();

  return <ConfigTables {...data} />;
}
