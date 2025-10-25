import { type ColumnDef } from "@tanstack/react-table"
import { TaskPriority, TaskStatus } from '@repo/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";

export type Tasks = {
  id: string
  title: string
  description: string
  deadline: string
  priority: TaskPriority
  status: TaskStatus
  createdByName: string
  assignedUserIds?: string[] // Adicione isso se necessário
}

export type TasksResponse = {
  tasks: Tasks[]
  total: number
  page: number
  size: number
  totalPages: number
}

// Interface para as props das colunas
interface ColumnsProps {
  onEditTask: (task: Tasks) => void
  onDeleteTask?: (task: Tasks) => void
  onViewComments?: (task: Tasks) => void
}

export const getColumns = ({ 
  onEditTask, 
  onDeleteTask, 
  onViewComments 
}: ColumnsProps): ColumnDef<Tasks>[] => [
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const task = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4 text-white"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEditTask(task)}>
              Editar Tarefa
            </DropdownMenuItem>
            {onDeleteTask && (
              <DropdownMenuItem 
                onClick={() => onDeleteTask(task)}
                className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
              >
                Excluir Tarefa
              </DropdownMenuItem>
            )}
            {onViewComments && (
              <DropdownMenuItem onClick={() => onViewComments(task)}>
                Visualizar Comentários
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Título",
  },
  {
    id: "deadline",
    accessorKey: "deadline",
    header: "Prazo",
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as string
      return deadline ? new Date(deadline).toLocaleDateString('pt-BR') : '-'
    }
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority
      const priorityLabels = {
        LOW: 'Baixa',
        MEDIUM: 'Média',
        HIGH: 'Alta',
        URGENT: 'Urgente'
      }
      return priorityLabels[priority] || priority
    }
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus
      const statusLabels = {
        TODO: 'Pendente',
        IN_PROGRESS: 'Em Progresso',
        REVIEW: 'Em Revisão',
        DONE: 'Concluída'
      }
      return statusLabels[status] || status
    }
  },
  {
    id: "createdByName",
    accessorKey: "createdByName",
    header: "Criado por",
  }
]