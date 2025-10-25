import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { TaskFormData } from '@/tasks/schemas/taskSchema'
import { toast } from 'sonner'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      const response = await api.post('/tasks', taskData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task criada com sucesso!')
    },
  })
}