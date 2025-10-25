// hooks/useTasks.ts
import api from '@/api/api'
import { useQuery } from '@tanstack/react-query'
import type { TasksResponse } from "../tasks/components/table-columns";

interface UseTasksParams {
  page: number;
  size: number;
  search?: string;
  priority?: string;
  status?: string;
  dueDateRange?: string;
  assignedToMe?: boolean;
  createdByMe?: boolean;
}

export function useTasks({ 
  page = 1, 
  size = 10, 
  search = "", 
  priority = "", 
  status = "", 
  dueDateRange = "", 
  assignedToMe = false, 
  createdByMe = false 
}: UseTasksParams) {
  return useQuery({
    queryKey: ['tasks', page, size, search, priority, status, dueDateRange, assignedToMe, createdByMe],
    queryFn: async (): Promise<TasksResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search && { search }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(dueDateRange && { dueDateRange }),
        ...(assignedToMe && { assignedToMe: 'true' }),
        ...(createdByMe && { createdByMe: 'true' }),
      });

      const response = await api.get(`/tasks?${params.toString()}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}