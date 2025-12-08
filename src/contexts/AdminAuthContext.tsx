import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
    try {
      const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      return !error && data === true;
    } catch { 
      return false; 
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            setTimeout(() => {
              if (mounted) {
                checkAdminRole(currentSession.user.id).then(r => mounted && setIsAdmin(r));
              }
            }, 0);
          } else {
            setIsAdmin(false);
          }
        });

        const { data: { session: existingSession } } = await supabase.auth.getSession();
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: new Error("Invalid email or password. Please try again.") };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: new Error("Please verify your email before logging in.") };
        }
        return { error: new Error(error.message) };
      }
      if (data.user) {
        const hasAdmin = await checkAdminRole(data.user.id);
        if (!hasAdmin) {
          await supabase.auth.signOut();
          return { error: new Error("You do not have admin access. Contact the administrator.") };
        }
        setIsAdmin(true);
      }
      return { error: null };
    } catch (e) { 
      return { error: new Error("Network error. Please check your connection and try again.") }; 
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { emailRedirectTo: `${window.location.origin}/admin` } 
      });
      if (error) {
        if (error.message.includes('already registered')) {
          return { error: new Error("This email is already registered.") };
        }
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (e) { 
      return { error: new Error("Network error. Please check your connection.") }; 
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Silent fail on sign out errors
    }
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
