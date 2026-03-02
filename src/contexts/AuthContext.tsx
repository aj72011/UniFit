import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

const GUEST_MODE_KEY = "projectgrade_guest_mode";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isGuest: false,
  continueAsGuest: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applySessionState = (currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        localStorage.removeItem(GUEST_MODE_KEY);
        setIsGuest(false);
      } else {
        setIsGuest(localStorage.getItem(GUEST_MODE_KEY) === "true");
      }

      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionValue) => {
      applySessionState(sessionValue);
    });

    supabase.auth.getSession().then(({ data: { session: sessionValue } }) => {
      applySessionState(sessionValue);
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_MODE_KEY, "true");
    setSession(null);
    setUser(null);
    setIsGuest(true);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_MODE_KEY);
      setSession(null);
      setUser(null);
      setIsGuest(false);
      return;
    }

    await supabase.auth.signOut();
    localStorage.removeItem(GUEST_MODE_KEY);
    setIsGuest(false);
  }, [isGuest]);

  return (
    <AuthContext.Provider value={{ user, session, loading, isGuest, continueAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
