import api from '@/api/api'
import { useQuery } from '@tanstack/react-query'
import type { TasksResponse } from "../tasks/components/table-columns";

export function useTasks(page: number = 1, size: number = 10) {
  return useQuery({
    queryKey: ['tasks', page, size],
    queryFn: async (): Promise<TasksResponse> => {
      const response = await api.get(`/tasks?page=${page}&size=${size}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}