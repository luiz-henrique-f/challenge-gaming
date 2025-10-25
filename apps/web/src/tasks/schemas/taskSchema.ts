// schemas/taskSchema.ts
import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  description: z.string().optional(),
  deadline: z.string()
            .optional()
    .refine((value) => {
      if (!value) return true
      
      const selectedDate = new Date(value)
      const currentDate = new Date()
      
      currentDate.setSeconds(0, 0)
      selectedDate.setSeconds(0, 0)
      
      return selectedDate >= currentDate
    }, {
      message: 'Informe data e hora atual válida'
    }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  assignedUserIds: z.array(z.string()).optional(),
})

export type TaskFormData = z.infer<typeof taskFormSchema>

// Valores padrão separados
export const defaultTaskFormValues: TaskFormData = {
  title: '',
  description: '',
  deadline: '',
  priority: 'MEDIUM',
  status: 'TODO',
  assignedUserIds: [],
}