import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConsultantIdForUser, getTalentProfileData, getActiveCountries } from "@/lib/talentProfileData";
import { TalentProfile } from "@/app/components/talent/profile/TalentProfile";

export default async function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/");
  }

  const { id } = await params;
  const profile = await getTalentProfileData(id, sessionUser.id);

  if (!profile) {
    const ownConsultantId = await getConsultantIdForUser(sessionUser.id);
    if (ownConsultantId && ownConsultantId !== id) {
      redirect(`/talent/profile/${ownConsultantId}`);
    }
    notFound();
  }

  const countries = await getActiveCountries();

  return <TalentProfile profile={profile} countries={countries} />;
}
