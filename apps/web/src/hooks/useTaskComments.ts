// hooks/useTaskComments.ts
import { useQuery } from '@tanstack/react-query'
import type { CommentsResponse } from '@repo/types'
import api from '@/api/api'

export function useTaskComments(
  taskId: string, 
  page: number = 1, 
  size: number = 10,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['task-comments', taskId, page, size],
    queryFn: async (): Promise<CommentsResponse> => {
      const response = await api.get(`/tasks/${taskId}/comments?page=${page}&size=${size}`)
      return response.data
    },
    enabled: options?.enabled !== false && !!taskId, // ← importante
    staleTime: 1000 * 60 * 5,
  })
}