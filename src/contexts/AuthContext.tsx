import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase.service";
import api from "../api/axios";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: User | null) => {
        if (currentUser) {
          try {
            let tokenResult = await currentUser.getIdTokenResult();

            if (!tokenResult.claims.admin) {
              tokenResult = await currentUser.getIdTokenResult(true);
            }

            if (tokenResult.claims.admin) {
              if (user?.uid !== currentUser.uid) {
                setUser(currentUser);
              }

              const token = await currentUser.getIdToken();

              if (token === "mock-token") {
                console.error("CRITICAL: Detectado token mock!");
              }

              api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } else {
              await signOut(auth);
              setUser(null);
              alert("Acesso negado: Apenas administradores.");
            }
          } catch (error) {
            console.error("Error in auth state change handler:", error);
          }
        } else {
          setUser(null);
          delete api.defaults.headers.common["Authorization"];
        }
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
