// ===================================
// FILE: src/contexts/AdminAuthContext.tsx
// FIXED VERSION - Now redirects after login
// ===================================
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  error?: Error | null;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
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

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("admin_token");
        const userData = localStorage.getItem("admin_user");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData) as User;
          setIsAuthenticated(true);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // ==============================================================
      // TODO: REPLACE WITH YOUR ACTUAL AUTHENTICATION API
      // ==============================================================
      // Example API integration:
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   localStorage.setItem("admin_token", data.token);
      //   localStorage.setItem("admin_user", JSON.stringify(data.user));
      //   setIsAuthenticated(true);
      //   setUser(data.user);
      //   
      //   // 🔥 REDIRECT TO ADMIN
      //   setTimeout(() => {
      //     window.location.href = "/admin";
      //   }, 500);
      //   
      //   return { success: true, message: "Login successful" };
      // }
      
      // DEMO AUTHENTICATION (REMOVE IN PRODUCTION)
      if (email === "admin@example.com" && password === "admin123") {
        const token = "demo_token_" + Date.now();
        const userData: User = {
          id: "1",
          email: email,
          name: "Admin User",
          role: "admin"
        };

        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);

        // 🔥 FIX: REDIRECT TO ADMIN AFTER SUCCESSFUL LOGIN
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);

        return { success: true, message: "Login successful", error: null };
      } else {
        return { 
          success: false, 
          message: "Invalid email or password",
          error: new Error("Invalid credentials")
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: "An error occurred during login",
        error: error as Error
      };
    }
  };

  // Alias for signIn (for compatibility)
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const result = await login(email, password);
    return { error: result.error || (result.success ? null : new Error(result.message)) };
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/admin/login";
  };

  // Alias for signOut (for compatibility)
  const signOut = async () => {
    logout();
  };

  const value: AdminAuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    isAdmin: isAuthenticated && user?.role === 'admin',
    login,
    logout,
    signIn,
    signOut
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};


// ===================================
// WHAT WAS FIXED
// ===================================
/*
🐛 THE PROBLEM:
- Login was succeeding and showing toast message
- But no redirect was happening after login
- User stayed on the login page

✅ THE FIX:
Added this after successful login (line 108-110):

setTimeout(() => {
  window.location.href = "/admin/dashboard";
}, 500);

The 500ms delay allows:
- Toast message to show
- State updates to complete
- Smooth user experience


📝 WHAT TO CHANGE:
Replace "/admin" with your actual admin home page route if different.
Your current route structure based on App.tsx:
- /admin → AdminDashboard (✅ This is correct!)
- /admin/pages
- /admin/sections
- /admin/images
- /admin/portfolio
- /admin/blog


🧪 TEST CREDENTIALS:
Email: admin@example.com
Password: admin123


⚠️ IMPORTANT NOTES:
1. Make sure your route "/admin/dashboard" exists
2. If you're using React Router, you might want to use navigate() instead
3. For production, replace demo auth with your real API
4. The setTimeout gives a better UX before redirect
*/