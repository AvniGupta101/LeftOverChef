// src/hooks/useListing.js
// src/hooks/useListings.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useListing({ status = "", page = 1 } = {}) {
  return useQuery({
    queryKey: ["listings", status, page],
    queryFn: async () => {
      const params = {
        _page: page,
        _limit: 12,
        _sort: "createdAt",
        _order: "desc",
      };

      // Only apply status filter if frontend explicitly requests it
      if (status) {
        params.status = status;
      }

      console.log("Fetching listings from:", api.defaults.baseURL);
      console.log("Parameters:", params);

      const { data } = await api.get("/listings", { params });

      console.log("Listings fetched:", data);
      return data;
    },
    staleTime: 1000 * 30,
  });
}
