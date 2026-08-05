import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { ConsultantProfile } from "@/app/components/consultants/ConsultantProfile";
import { getConsultantById } from "@/lib/consultantsData";

export default async function ConsultantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const consultant = await getConsultantById(id, user.id);

  if (!consultant) {
    notFound();
  }

  return <ConsultantProfile consultant={consultant} />;
}
