"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "@/services/firebase";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="p-6">
        Vérification...
      </div>
    );
  }

  return <>{children}</>;
}