import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useApi = (key, fetchFn, options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000,
    ...options
  })
}

export const useMutationApi = (mutationFn, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries)
      }
    }
  })
}

export const usePaginatedQuery = (key, fetchFn, page, filters = {}) => {
  return useQuery({
    queryKey: [key, page, filters],
    queryFn: () => fetchFn({ page, ...filters }),
    keepPreviousData: true
  })
}
