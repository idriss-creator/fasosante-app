"use client";

import { useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { getUserRole } from "@/services/users";

export default function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userRole = await getUserRole(user.uid);

      setRole(userRole);
      setLoading(false);
    };

    loadRole();
  }, []);

  return { role, loading };
}