// src/hooks/useClaims.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export function useClaims() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["claims", user?.id || user?._id || "anonymous"],
    queryFn: async () => {
      console.log("Fetching claims for user:", user);
      const { data } = await api.get("/claims");
      console.log("Claims received:", data);
      return data;
    },
    enabled: Boolean(isAuthenticated && user), // only run when logged in
    staleTime: 1000 * 30,
  });
}