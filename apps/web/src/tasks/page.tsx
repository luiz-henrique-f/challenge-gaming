import { useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/table-columns";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// const data: Tasks[] = [
//   {
//     id: "1a2b3c4d",
//     title: "Task 1",
//     description: "Description for Task 1",
//     deadline: "2025-10-25T23:59:59.000Z",
//     priority: 'HIGH' as TaskPriority,
//     status: 'DONE' as TaskStatus,
//     createdBy: "7cacd4f0-febf-4794-b82a-d7b41391b14d"
//   },
//   {
//     id: "1a2b3c4d",
//     title: "Task 1",
//     description: "Description for Task 1",
//     deadline: "2025-10-25T23:59:59.000Z",
//     priority: 'HIGH' as TaskPriority,
//     status: 'DONE' as TaskStatus,
//     createdBy: "7cacd4f0-febf-4794-b82a-d7b41391b14d"
//   },
// ]

export function TasksPage() {
  const [page, setPage] = useState(1)
  const size = 3
  const { data, isLoading, isError } = useTasks(page, size)

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (data && page < data.total) {
      setPage(page + 1)
    }
  }

  console.log('data.total', data?.totalPages);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tasks...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Não foi possível renderizar a listagem no momento</div>
      </div>
    )
  }

    return (
    <div className="space-y-4">
      <div>
        Filtros
      </div>
      
      <DataTable 
        columns={columns} 
        data={data?.tasks || []}
      />
      
      {/* Controles de paginação */}
      {data && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * size) + 1} a {Math.min(page * size, data.total)} de {data.total} tasks
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="text-sm font-medium">
              Página {page} de {data.totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= data.totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}