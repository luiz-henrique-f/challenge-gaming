import api from '@/api/api'
import type { TaskFormData } from '@/tasks/schemas/taskSchema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UpdateTaskParams {
  taskId: string
  taskData: Partial<TaskFormData>
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, taskData }: UpdateTaskParams) => {
      const response = await api.put(`/tasks/${taskId}`, taskData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task atualizada com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar task:', error)
      toast.error('Erro ao atualizar task')
    },
  })
}