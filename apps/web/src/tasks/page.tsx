import { useNotifications } from "@/hooks/useNotifications";
import { DataTable } from "./components/data-table";
import { columns, type Tasks } from "./components/table-columns";
import { type TaskPriority, type TaskStatus } from '@repo/types';
import { useAuth } from "@/context/AuthContext";

const data: Tasks[] = [
  {
    id: "1a2b3c4d",
    title: "Task 1",
    description: "Description for Task 1",
    deadline: "2025-10-25T23:59:59.000Z",
    priority: 'HIGH' as TaskPriority,
    status: 'DONE' as TaskStatus,
    createdBy: "7cacd4f0-febf-4794-b82a-d7b41391b14d"
  },
  {
    id: "1a2b3c4d",
    title: "Task 1",
    description: "Description for Task 1",
    deadline: "2025-10-25T23:59:59.000Z",
    priority: 'HIGH' as TaskPriority,
    status: 'DONE' as TaskStatus,
    createdBy: "7cacd4f0-febf-4794-b82a-d7b41391b14d"
  },
]

export function TasksPage() {
    return(
        <div>
            <div>
                Filtros
            </div>
            <div>
                <DataTable columns={columns} data={data}/>
            </div>
        </div>
)
}