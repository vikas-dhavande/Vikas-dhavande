"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { account, checkUserRole, UserRoleInfo } from "@/lib/appwrite";
import { Models } from "appwrite";

export interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  role: "admin" | "member" | "guest";
  isAdmin: boolean;
  isAuthLoading: boolean;
  avatarSeed: string;
  refreshAuth: () => Promise<void>;
  setUserOptimistic: (user: Models.User<Models.Preferences> | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "guest",
  isAdmin: false,
  isAuthLoading: true,
  avatarSeed: "",
  refreshAuth: async () => {},
  setUserOptimistic: () => {},
  logout: async () => {},
});

const AUTH_COOKIE_NAME = "auth_user";
const AVATAR_COOKIE_NAME = "avatar_seed";

function persistAuthIndicators(user: Models.User<Models.Preferences> | null) {
  if (typeof window === "undefined") return;

  try {
    if (user) {
      const minimalUser = JSON.stringify({
        $id: user.$id,
        name: user.name,
        email: user.email,
      });
      localStorage.setItem("auth_user", minimalUser);
      localStorage.setItem("avatar_seed", user.name || user.email.split("@")[0]);
      document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `${AVATAR_COOKIE_NAME}=${encodeURIComponent(
        user.name || user.email.split("@")[0]
      )}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("avatar_seed");
      document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `${AVATAR_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    }
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo>({
    isAdmin: false,
    role: "guest",
    user: null,
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [avatarSeed, setAvatarSeed] = useState<string>("");

  const syncAuth = useCallback(async (broadcast = true) => {
    try {
      const currentUser = await account.get();
      const currentRole = await checkUserRole(currentUser);

      setUser(currentUser);
      setRoleInfo(currentRole);
      const seed = currentUser.name || currentUser.email.split("@")[0];
      setAvatarSeed(seed);
      persistAuthIndicators(currentUser);

      if (broadcast && typeof window !== "undefined") {
        try {
          const channel = new BroadcastChannel("appwrite_auth_sync");
          channel.postMessage({ type: "AUTH_CHANGED", userId: currentUser.$id });
          channel.close();
        } catch {}
      }
    } catch {
      setUser(null);
      setRoleInfo({ isAdmin: false, role: "guest", user: null });
      setAvatarSeed("");
      persistAuthIndicators(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const setUserOptimistic = useCallback((newUser: Models.User<Models.Preferences> | null) => {
    setUser(newUser);
    if (newUser) {
      const seed = newUser.name || newUser.email.split("@")[0];
      setAvatarSeed(seed);
      persistAuthIndicators(newUser);
      setIsAuthLoading(false);
      checkUserRole(newUser).then((info) => setRoleInfo(info));
    } else {
      setRoleInfo({ isAdmin: false, role: "guest", user: null });
      setAvatarSeed("");
      persistAuthIndicators(null);
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial verification
    syncAuth(false);

    // BroadcastChannel cross-tab synchronization (T-06, L-08)
    if (typeof window !== "undefined") {
      let channel: BroadcastChannel | null = null;
      try {
        channel = new BroadcastChannel("appwrite_auth_sync");
        channel.onmessage = (event) => {
          if (event.data?.type === "AUTH_CHANGED" || event.data?.type === "LOGOUT") {
            syncAuth(false);
          }
        };
      } catch {}

      // Cross-tab storage fallback for browsers without BroadcastChannel
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "auth_user" || e.key === "avatar_seed") {
          syncAuth(false);
        }
      };

      // Custom in-window event dispatch
      const handleCustomAuthChange = () => {
        syncAuth(false);
      };

      // Tab focus auto-sync
      const handleFocus = () => {
        syncAuth(false);
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener("appwrite-auth-changed", handleCustomAuthChange);
      window.addEventListener("focus", handleFocus);

      return () => {
        if (channel) channel.close();
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("appwrite-auth-changed", handleCustomAuthChange);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [syncAuth]);

  const logout = useCallback(async () => {
    try {
      if (account && typeof account.deleteSession === "function") {
        await account.deleteSession("current");
      }
    } catch {
      // Even if network or session is already gone, proceed with client cleanup
    } finally {
      setUser(null);
      setRoleInfo({ isAdmin: false, role: "guest", user: null });
      setAvatarSeed("");
      persistAuthIndicators(null);

      if (typeof window !== "undefined") {
        try {
          const channel = new BroadcastChannel("appwrite_auth_sync");
          channel.postMessage({ type: "LOGOUT" });
          channel.close();
        } catch {}
        window.dispatchEvent(new Event("appwrite-auth-changed"));
      }
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role: roleInfo.role,
      isAdmin: roleInfo.isAdmin,
      isAuthLoading,
      avatarSeed,
      refreshAuth: () => syncAuth(true),
      setUserOptimistic,
      logout,
    }),
    [user, roleInfo.role, roleInfo.isAdmin, isAuthLoading, avatarSeed, syncAuth, setUserOptimistic, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
