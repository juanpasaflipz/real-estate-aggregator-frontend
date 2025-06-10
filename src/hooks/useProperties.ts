import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SearchFilters, Property, UserPreferences } from '@/types/property';

export function usePropertySearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => apiClient.searchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => apiClient.getProperty(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.checkHealth(),
    refetchInterval: 30000, // Check every 30 seconds
  });
}

export function useSavePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences: UserPreferences) => 
      apiClient.saveUserPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}