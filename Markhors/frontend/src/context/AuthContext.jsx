import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("markhorsAdminUser");
    const savedUser = localStorage.getItem("markhorsUser");
    if (savedAdmin) {
      try {
        setUser(JSON.parse(savedAdmin));
      } catch (e) {
        // ignore
      }
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  // Admin login (kept for existing admin portal)
  const login = (username, password) => {
    const validCredentials = {
      username: "admin",
      password: "markhors123",
    };

    if (
      username === validCredentials.username &&
      password === validCredentials.password
    ) {
      const userData = { username, id: Date.now(), role: "admin" };
      setUser(userData);
      localStorage.setItem("markhorsAdminUser", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  // Client registration (local, for demo purposes)
  const register = ({ name, email, password }) => {
    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const usersRaw = localStorage.getItem("markhorsUsers");
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const exists = users.find((u) => u.email === email.toLowerCase());
    if (exists) {
      return { success: false, message: "Email already registered" };
    }

    const newUser = { id: Date.now(), name, email: email.toLowerCase(), password };
    users.push(newUser);
    localStorage.setItem("markhorsUsers", JSON.stringify(users));

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: "user" };
    setUser(sessionUser);
    localStorage.setItem("markhorsUser", JSON.stringify(sessionUser));
    return { success: true };
  };

  const clientLogin = (email, password) => {
    const usersRaw = localStorage.getItem("markhorsUsers");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email === (email || "").toLowerCase() && u.password === password);
    if (found) {
      const sessionUser = { id: found.id, name: found.name, email: found.email, role: "user" };
      setUser(sessionUser);
      localStorage.setItem("markhorsUser", JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("markhorsAdminUser");
    localStorage.removeItem("markhorsUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, clientLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
