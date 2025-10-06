"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
} | null;

interface UserContextType {
  user: User;
  loading: boolean;
  refreshUser: (id?: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const refreshUser = useCallback(
    async (id?: string) => {
      if (!id && !user?.id) return;
      setLoading(true);
      try {
        const userId = id || user?.id;
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setUser(updated);
        }
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      if (sessionUser && sessionUser.id) {
        try {
          const res = await fetch(`/api/users/${sessionUser.id}`);
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUser();
  }, [sessionUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
