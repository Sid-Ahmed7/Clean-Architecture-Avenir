import { useState, useEffect } from "react";
import { apiClient } from "../api/apiClient";

interface UserProfile {
  userId: string; 
  role: string;
  name?: string;
  email?: string;
}


export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    setLoading(true);
    setError(null);

    apiClient.get("/auth/profile").then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
