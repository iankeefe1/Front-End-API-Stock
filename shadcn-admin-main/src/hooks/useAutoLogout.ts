import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAutoLogout() {
  const { auth } = useAuthStore();

  useEffect(() => {
    const checkSession = () => {
      const user = auth.user;

      if (user && Date.now() > user.exp) {
        auth.reset();
        window.location.href = "/login";
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10000);

    return () => clearInterval(interval);
  }, [auth]);
}
