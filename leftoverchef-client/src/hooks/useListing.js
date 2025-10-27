// src/hooks/useListing.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useListing(listingId) {
  return useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const { data } = await api.get(`/listings/${listingId}`);
      return data;
    },
    enabled: Boolean(listingId),
    staleTime: 1000 * 30,
  });
}
