import { createContext, useContext, useState, useEffect } from 'react';
import { useBoolean, useColorMode } from '@chakra-ui/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useBoolean(localStorage.getItem("token") ? true : false);
  const [user, setUser] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

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