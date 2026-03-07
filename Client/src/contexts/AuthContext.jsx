import { createContext, useState } from "react";
import { api, readApiError, TOKEN_KEY } from "../services/api";

const USER_KEY = "aura_user";
const AuthContext = createContext(null);

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => parseJSON(localStorage.getItem(USER_KEY)));
  const [authLoading, setAuthLoading] = useState(false);

  const persistSession = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    setToken(nextToken || "");
    setUser(nextUser || null);
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistSession(data.token, data.user);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: readApiError(error, "Login failed.") };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistSession(data.token, data.user);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: readApiError(error, "Registration failed.") };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout");
      }
    } catch {
      // Ignore logout network failures and clear client session anyway.
    } finally {
      persistSession("", null);
    }
  };

  const value = {
    token,
    user,
    authLoading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
