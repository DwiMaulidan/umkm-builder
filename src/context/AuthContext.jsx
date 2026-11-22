import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("umkm_token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("umkm_user")) || null;
    } catch {
      return null;
    }
  });

  const [business, setBusiness] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("umkm_business")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("umkm_token");
    localStorage.removeItem("umkm_user");
    localStorage.removeItem("umkm_business");

    setToken(null);
    setUser(null);
    setBusiness(null);
  };

  const saveSession = (data) => {
    localStorage.setItem("umkm_token", data.token);
    localStorage.setItem("umkm_user", JSON.stringify(data.user));
    localStorage.setItem("umkm_business", JSON.stringify(data.business));

    setToken(data.token);
    setUser(data.user);
    setBusiness(data.business);
  };

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("umkm_token");

      if (!savedToken) {
        setAuthInitializing(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me");

        setToken(savedToken);
        setUser(data.user);

        // Business tetap menggunakan data sesi yang tersimpan.
        const savedBusiness = localStorage.getItem("umkm_business");

        if (savedBusiness) {
          setBusiness(JSON.parse(savedBusiness));
        }
      } catch (error) {
        console.error("Session verification failed:", error.message);
        clearSession();
      } finally {
        setAuthInitializing(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        business,
        loading,
        authInitializing,
        isAuthenticated: Boolean(token),
        login,
        register,
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
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider"
    );
  }

  return context;
};
