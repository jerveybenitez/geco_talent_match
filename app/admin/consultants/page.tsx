import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConsultantsData } from "@/lib/consultantsData";
import { Consultants } from "@/app/components/Consultants";

export default async function ConsultantsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getConsultantsData(user.id);

  if (!data) {
    redirect("/");
  }

  return <Consultants consultants={data.consultants} countries={data.countries} />;
}
