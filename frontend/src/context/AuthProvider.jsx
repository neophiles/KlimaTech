import { createContext, useContext, useState, useEffect } from 'react';
import { useBoolean, useColorMode } from '@chakra-ui/react';
import { userMe } from '../api/users';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useBoolean(localStorage.getItem("token") ? true : false);
  const [user, setUser] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  // Fetch user data on mount if token exists
  useEffect(() => {
    async function loadUserData() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await userMe(token);
          setUser(userData);
          setIsAuthenticated.on();
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          // Token might be invalid, clear it
          localStorage.removeItem("token");
          setIsAuthenticated.off();
        }
      }
    }
    loadUserData();
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && colorMode === 'dark') {
      toggleColorMode();
    }
  }, [isAuthenticated, colorMode, toggleColorMode]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated.on();
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated.off();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}