// hooks/useCreateComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import api from '@/lib/api'
import { toast } from 'sonner'
import type { CreateCommentsDto } from '@repo/types'
import api from '@/api/api'

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commentData: CreateCommentsDto) => {
      const response = await api.post(`/tasks/${commentData.taskId}/comments`, {
        content: commentData.content
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalida e refetch dos comentários da task específica
      queryClient.invalidateQueries({ 
        queryKey: ['task-comments', variables.taskId] 
      })
      toast.success('Comentário adicionado!')
    },
    onError: (error: any) => {
      console.error('Erro ao criar comentário:', error)
      toast.error('Erro ao adicionar comentário')
    },
  })
}