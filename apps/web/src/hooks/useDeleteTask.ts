import api from '@/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.delete(`/tasks/${taskId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task excluída com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao excluir task:', error)
      toast.error('Erro ao excluir task')
      if (error.response) {
        console.log('Resposta do servidor:', error.response.data)
      }
    },
  })
}