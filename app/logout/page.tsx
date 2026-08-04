"use client";

import { useRouter } from "next/navigation";
import { TalentLoggedOut } from "@/app/components/TalentLoggedOut";

export default function LoggedOutPage() {
  const router = useRouter();

  return <TalentLoggedOut onBackToLogin={() => router.push("/")} />;
}