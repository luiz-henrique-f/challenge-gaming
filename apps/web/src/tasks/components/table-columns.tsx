import { type ColumnDef } from "@tanstack/react-table"
import { TaskPriority, TaskStatus } from '@repo/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  createdBy: string
}

export type TasksResponse = {
  tasks: Tasks[]
  total: number
  page: number
  size: number
  totalPages: number
}

export const columns: ColumnDef<Tasks>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Título",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descrição",
  },
  {
    id: "deadline",
    accessorKey: "deadline",
    header: "Prazo",
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: "Prioridade",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Criado por",
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4 text-white"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }
  }
]