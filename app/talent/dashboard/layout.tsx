import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TalentShell } from "@/app/components/talent/TalentShell";

export default async function TalentDashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  if (user.role !== "user") {
    redirect("/admin/dashboard");
  }

  return <TalentShell user={user}>{children}</TalentShell>;
}
