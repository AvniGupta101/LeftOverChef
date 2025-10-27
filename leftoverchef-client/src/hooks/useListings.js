// src/hooks/useListings.js
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useListings({ status = 'approved', page = 1 } = {}) {
  return useQuery({
    queryKey: ['listings', status, page],
    queryFn: async () => {
      const params = { status, _page: page, _limit: 12, _sort: 'createdAt', _order: 'desc' }
      console.log('Fetching listings from:', api.defaults.baseURL) // debug
      const { data } = await api.get('/listings', { params })
      console.log('Listings fetched:', data) // debug
      return data
    },
    staleTime: 1000 * 30,
    // you can add enabled: true if you want to control when it runs
  })
}
