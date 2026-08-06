import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/app/components/DashboardShell";

export default async function ConfigLayout({ children }: { children: React.ReactNode }) {
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

  if (user.role !== "superadmin") {
    redirect("/admin/dashboard");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
