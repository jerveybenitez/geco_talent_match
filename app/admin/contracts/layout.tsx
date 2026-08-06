import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/app/components/admin/DashboardShell";

export default async function ContractsLayout({ children }: { children: React.ReactNode }) {
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
      countriesHandled: { select: { countryCode: true } },
    },
  });

  if (!user) {
    redirect("/");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
