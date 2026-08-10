import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getConsultantIdForUser, getTalentProfileData } from "@/lib/talentProfileData";
import { computeProfileCompleteness } from "@/lib/profileCompleteness";
import { TalentDashboard } from "@/app/components/talent/TalentDashboard";

export default async function TalentDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const consultantId = await getConsultantIdForUser(user.id);
  const profile = consultantId ? await getTalentProfileData(consultantId, user.id) : null;

  const completeness = computeProfileCompleteness(
    profile
      ? {
          name: profile.name,
          phone: profile.phone,
          city: profile.city,
          countryId: profile.countryId,
          hasLanguage: profile.languages.length > 0,
          roleTitle: profile.roleTitle,
          linkedin: profile.linkedin,
          hasSkill: profile.skills.length > 0,
          hasIndustry: profile.industries.length > 0,
          yearsOfExperience: profile.yearsOfExperience,
        }
      : {
          name: user.name,
          phone: null,
          city: "",
          countryId: "",
          hasLanguage: false,
          roleTitle: "",
          linkedin: null,
          hasSkill: false,
          hasIndustry: false,
          yearsOfExperience: null,
        }
  );

  return <TalentDashboard talentName={user.name} consultantId={consultantId} completeness={completeness} />;
}
