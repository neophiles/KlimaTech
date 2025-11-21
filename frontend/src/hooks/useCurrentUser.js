import { useState, useEffect } from "react";
import { userMe } from "../api/users"; // adjust path as needed

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }
        const userData = await userMe(token);
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCurrentUser();
  }, []);

  return { user, isLoading, error };
}