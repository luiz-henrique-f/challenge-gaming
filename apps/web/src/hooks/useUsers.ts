// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'

export interface User {
  id: string
  name: string
  username: string
  avatar?: string
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get('/auth/users')
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}