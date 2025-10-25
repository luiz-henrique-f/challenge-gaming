// components/EditTaskModal.tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useUpdateTask } from '@/hooks/useUpdateTask'
import { taskFormSchema, type TaskFormData } from '../schemas/taskSchema'
import { Textarea } from '@/components/ui/textarea'
import { UserMultiSelect } from './user-multiselect'
import { useUsers } from '@/hooks/useUsers'
import { useEffect } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  deadline?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  assignedUserIds?: string[]
}

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const updateTaskMutation = useUpdateTask()
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      priority: 'MEDIUM',
      status: 'TODO',
      assignedUserIds: [],
    },
  })

  useEffect(() => {
    if (task) {
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
      }

      form.reset({
        title: task.title,
        description: task.description || '',
        deadline: formatDateForInput(task.deadline),
        priority: task.priority,
        status: task.status,
        assignedUserIds: task.assignedUserIds || [],
      })
    }
  }, [task, form])

  const onSubmit = async (data: TaskFormData) => {
    if (!task) return

    const payload: Partial<TaskFormData> = {
      ...data,
      ...(data.title !== task.title && { title: data.title }),
      ...(data.description !== task.description && { description: data.description }),
      ...(data.deadline !== (task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '') && {
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined
      }),
      ...(data.priority !== task.priority && { priority: data.priority }),
      ...(data.status !== task.status && { status: data.status }),
      ...(JSON.stringify(data.assignedUserIds) !== JSON.stringify(task.assignedUserIds) && {
        assignedUserIds: data.assignedUserIds
      }),
    }

    Object.keys(payload).forEach(key => {
      if (payload[key as keyof TaskFormData] === undefined) {
        delete payload[key as keyof TaskFormData]
      }
    })

    try {
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        taskData: payload
      })
      form.reset()
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar task:', error)
      if ((error as any).response) {
        console.log('🧩 Resposta do servidor:', (error as any).response.data)
      }
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#121620] border border-blue-900/30 rounded-xl shadow-lg text-white">
        <DialogHeader>
          <DialogTitle>Editar Task</DialogTitle>
          <DialogDescription>
            Edite os dados da task. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o título da task" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição da task"
                      className="resize-none"
                      maxLength={255}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Baixa</SelectItem>
                        <SelectItem value="MEDIUM">Média</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TODO">Pendente</SelectItem>
                        <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                        <SelectItem value="REVIEW">Concluída</SelectItem>
                        <SelectItem value="DONE">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <Controller
              control={form.control}
              name="assignedUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsáveis</FormLabel>
                  <FormControl>
                    <UserMultiSelect
                      users={users}
                      value={field.value ?? []}
                      onChange={(v) => field.onChange(v)}
                      disabled={isLoadingUsers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                className='cursor-pointer'
                onClick={handleClose}
                disabled={updateTaskMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className='cursor-pointer'
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}