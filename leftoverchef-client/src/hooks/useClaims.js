// src/hooks/useClaims.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth"; // assumes you export this hook

export function useClaims() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["claims", user?.id ?? "anonymous"],
    queryFn: async () => {
      // Do not send ngoId from client — backend will use req.user (from JWT)
      const { data } = await api.get("/claims", {
        params: { _sort: "createdAt", _order: "desc" },
      });
      return data;
    },
    enabled: Boolean(user?.id), // only run when logged in
    staleTime: 1000 * 30,
  });
}
