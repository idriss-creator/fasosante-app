"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  updateUserRole,
} from "@/services/users";

export default function UsersPage() {
  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const changeRole = async (
    uid: string,
    role: string
  ) => {
    await updateUserRole(
      uid,
      role
    );

    loadUsers();
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Utilisateurs
      </h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4"
          >
            <p>{user.email}</p>

            <p>
              Rôle :
              {user.role}
            </p>

            <select
              value={user.role}
              onChange={(e) =>
                changeRole(
                  user.id,
                  e.target.value
                )
              }
              className="border p-2 rounded mt-2"
            >
              <option value="user">
                User
              </option>

              <option value="owner">
                Owner
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>
        ))}
      </div>
    </main>
  );
}