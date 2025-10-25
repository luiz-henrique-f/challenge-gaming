import { useState } from "react";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/table-columns";
import { useTasks } from "@/hooks/useTasks";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskModal } from "@/hooks/useTaskModal";
import { CreateTaskModal } from "./components/create-task-modal";
import { EditTaskModal } from "./components/edit-task-modal";
import { DeleteTaskModal } from "./components/delete-task-modal"; // 👈 Importe a nova modal
import type { Tasks } from "./components/table-columns";

export function TasksPage() {
  const { isOpen, open, close } = useTaskModal()
  const [page, setPage] = useState(1);
  const size = 5;

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 👈 Novo estado
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);

  const { data, isLoading, isError } = useTasks(page, size);
  const deleteTaskMutation = useDeleteTask();

  const handlePreviousPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => data && page < data.totalPages && setPage(page + 1);

  const handleClearFilters = () => {
    setSearch("");
    setPriority("");
    setStatus("");
  };

  const handleEditTask = (task: Tasks) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (task: Tasks) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      deleteTaskMutation.mutate(selectedTask.id, {
        onSuccess: () => {
          handleCloseDeleteModal();
        }
      });
    }
  };

  const handleViewComments = (task: Tasks) => {
    console.log('Visualizar comentários da task:', task.id);
  };

  const columns = getColumns({
    onEditTask: handleEditTask,
    onDeleteTask: handleOpenDeleteModal,
    onViewComments: handleViewComments
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg">
        Carregando tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-lg text-red-500">
        Não foi possível renderizar a listagem no momento
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* 🔹 Filtros */}
      <div className="bg-[#121620] border border-blue-900/30 rounded-xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Busca */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="search" className="text-sm text-gray-300">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Título ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 bg-[#0B0F19] border-blue-900/40 text-gray-200 placeholder-gray-500"
              />
            </div>

            {/* Prioridade */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="priority" className="text-sm text-gray-300">
                Prioridade
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-40 bg-[#0B0F19] border-blue-900/40 text-gray-200">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="status" className="text-sm text-gray-300">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40 bg-[#0B0F19] border-blue-900/40 text-gray-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">A fazer</SelectItem>
                  <SelectItem value="DOING">Em andamento</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-blue-900/40 hover:bg-blue-950 text-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-200 hover:bg-transparent"
              onClick={handleClearFilters}
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
            <Button
              variant="default"
              className="text-gray-300 cursor-pointer"
              onClick={open}
              disabled={deleteTaskMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* 🔹 Tabela */}
      <DataTable 
        columns={columns} 
        data={data?.tasks || []} 
      />

      {/* 🔹 Paginação */}
      {data && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-400">
            Mostrando {((page - 1) * size) + 1} a {Math.min(page * size, data.total)} de {data.total} tasks
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1 || deleteTaskMutation.isPending}
              className="border-blue-900/40"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="text-sm font-medium text-gray-300">
              Página {page} de {data.totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= data.totalPages || deleteTaskMutation.isPending}
              className="border-blue-900/40"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 🔹 Modais */}
      <CreateTaskModal 
        isOpen={isOpen}
        onClose={close}
      />

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={selectedTask}
      />

      <DeleteTaskModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        task={selectedTask}
        isDeleting={deleteTaskMutation.isPending}
      />
    </div>
  );
}