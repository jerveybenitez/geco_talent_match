"use client";

import { useState } from "react";
import { UserList } from "./users/UserList";
import { UserFormModal } from "./users/UserFormModal";
import { UserSuccessModal } from "./users/UserSuccessModal";
import type { Country, ManagedUser } from "@/lib/usersManageData";

interface UsersManageProps {
  users: ManagedUser[];
  countries: Country[];
}

export function UsersManage({ users: initialUsers, countries }: UsersManageProps) {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAction, setSuccessAction] = useState<"created" | "updated">("created");

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const nextActive = !user.active;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      if (!res.ok) return;

      setUsers(users.map((u) => (u.id === userId ? { ...u, active: nextActive } : u)));
    } catch {
      // leave status unchanged if the request fails
    }
  };

  const handleSaved = (savedUser: ManagedUser, action: "created" | "updated") => {
    setUsers((prev) =>
      action === "updated"
        ? prev.map((u) => (u.id === savedUser.id ? savedUser : u))
        : [...prev, savedUser]
    );
    setEditingUser(null);
    setSuccessAction(action);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <UserList
        users={users}
        countries={countries}
        onAddUser={() => {
          setEditingUser(null);
          setShowAddUser(true);
        }}
        onEditUser={(user) => {
          setEditingUser(user);
          setShowAddUser(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      <UserFormModal
        open={showAddUser}
        onOpenChange={(open) => {
          setShowAddUser(open);
          if (!open) setEditingUser(null);
        }}
        editingUser={editingUser}
        countries={countries}
        onSaved={handleSaved}
      />

      <UserSuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        action={successAction}
      />
    </>
  );
}
