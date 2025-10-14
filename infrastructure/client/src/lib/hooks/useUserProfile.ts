"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiClient } from "../api/apiClient";

interface UserProfile {
  name: string;
  email: string;
}

export function useUserProfile(token: string) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    apiClient.get("/api/profile").then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { user, loading, error };
}
