"use client";

import { useRouter } from "next/navigation";
import { Login } from "./components/Login";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    router.push("/admin/dashboard");
    return true;
  };

  return <Login onLogin={handleLogin} />;
}