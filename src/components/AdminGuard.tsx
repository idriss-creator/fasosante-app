"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserRole from "@/hooks/useUserRole";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useUserRole();

  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/dashboard");
    }
  }, [role, loading, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (role !== "admin") {
    return null;
  }

  return <>{children}</>;
}