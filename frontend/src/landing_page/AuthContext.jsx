import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    // listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ VERY IMPORTANT: stable export
export const useAuth = () => {
  return useContext(AuthContext);
};