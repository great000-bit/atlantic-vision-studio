import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";

// Safe import of supabase
let supabaseClient: typeof import("@/integrations/supabase/client").supabase | null = null;
import("@/integrations/supabase/client")
  .then(mod => { supabaseClient = mod.supabase; })
  .catch(err => console.error("Failed to load Supabase:", err));

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    if (!supabaseClient) return false;
    try {
      const { data, error } = await supabaseClient.rpc('has_role', { _user_id: userId, _role: 'admin' });
      return !error && data === true;
    } catch { return false; }
  };

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      // Wait for supabase to load
      let attempts = 0;
      while (!supabaseClient && attempts < 20) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      
      if (!supabaseClient) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            setTimeout(() => mounted && checkAdminRole(currentSession.user.id).then(r => mounted && setIsAdmin(r)), 0);
          } else {
            setIsAdmin(false);
          }
        });

        const { data: { session: existingSession } } = await supabaseClient.auth.getSession();
        if (!mounted) return;
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        if (existingSession?.user) {
          const isAdminUser = await checkAdminRole(existingSession.user.id);
          if (mounted) setIsAdmin(isAdminUser);
        }
        if (mounted) setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch {
        if (mounted) setIsLoading(false);
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) return { error: new Error("Service unavailable") };
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) return { error: new Error(error.message) };
      if (data.user) {
        const hasAdmin = await checkAdminRole(data.user.id);
        if (!hasAdmin) {
          await supabaseClient.auth.signOut();
          return { error: new Error("You do not have admin access.") };
        }
        setIsAdmin(true);
      }
      return { error: null };
    } catch (e) { return { error: e as Error }; }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseClient) return { error: new Error("Service unavailable") };
    try {
      const { error } = await supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      return { error: error ? new Error(error.message) : null };
    } catch (e) { return { error: e as Error }; }
  };

  const signOut = async () => {
    if (supabaseClient) await supabaseClient.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!session, isLoading, user, session, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
