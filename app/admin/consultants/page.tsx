import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConsultantsData } from "@/lib/consultantsData";
import { Consultants } from "@/app/components/Consultants";

export default async function ConsultantsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const data = await getConsultantsData(user.id);

  if (!data) {
    redirect("/");
  }

  const { location } = await searchParams;

  return (
    <Consultants
      consultants={data.consultants}
      countries={data.countries}
      initialLocationFilter={location}
    />
  );
}
