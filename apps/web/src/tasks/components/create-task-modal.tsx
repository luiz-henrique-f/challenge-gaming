// components/CreateTaskModal.tsx
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
import { useCreateTask } from '@/hooks/useCreateTask'
import { taskFormSchema, type TaskFormData } from '../schemas/taskSchema'
import { Textarea } from '@/components/ui/textarea'
import { UserMultiSelect } from './user-multiselect'
import { useUsers } from '@/hooks/useUsers'
import { toast } from 'sonner'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const createTaskMutation = useCreateTask()
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

  const onSubmit = async (data: TaskFormData) => {
  const payload: TaskFormData = {
    ...data,
    deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined, // 👈 aqui o ajuste
  }

  try {
    await createTaskMutation.mutateAsync(payload)
    form.reset()
    onClose()
  } catch (error) {
    console.error('Erro ao criar task:', error)
    toast.error('Erro ao criar Tarefa')
    if ((error as any).response) {
      console.log('🧩 Resposta do servidor:', (error as any).response.data)
    }
  }
}

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#121620] border border-blue-900/30 rounded-xl shadow-lg text-white">
        <DialogHeader>
          <DialogTitle>Criar Nova Task</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova task. Clique em salvar quando terminar.
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
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              defaultValue={[]}
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
                disabled={createTaskMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className='cursor-pointer'
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? 'Criando...' : 'Criar Task'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}