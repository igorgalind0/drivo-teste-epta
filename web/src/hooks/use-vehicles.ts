import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { VehicleInput } from '@/lib/types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (search: string) => ['vehicles', 'list', search] as const,
  detail: (id: string) => ['vehicles', 'detail', id] as const,
};

export function useVehicles(search = '') {
  return useQuery({
    queryKey: vehicleKeys.list(search),
    queryFn: () => api.listVehicles(search),
    placeholderData: keepPreviousData,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => api.getVehicle(id),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleInput) => api.createVehicle(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<VehicleInput>) => api.updateVehicle(id, data),
    onSuccess: (vehicle) => {
      queryClient.setQueryData(vehicleKeys.detail(id), vehicle);
      return queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteVehicle(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
}