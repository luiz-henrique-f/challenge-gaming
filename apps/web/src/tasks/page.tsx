import { useState } from "react";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/table-columns";
import { useTasks } from "@/hooks/useTasks";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskModal } from "@/hooks/useTaskModal";
import { CreateTaskModal } from "./components/create-task-modal";
import { EditTaskModal } from "./components/edit-task-modal";
import { DeleteTaskModal } from "./components/delete-task-modal";
import type { Tasks } from "./components/table-columns";
import { TaskCommentsSheet } from "./components/task-comments-sheet";
// import { Footer } from "@/components/global/footer";

export function TasksPage() {
  const { isOpen, open, close } = useTaskModal()
  const [page, setPage] = useState(1);
  const size = 5;

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  
  // 🔹 NOVOS FILTROS
  const [dueDateRange, setDueDateRange] = useState(""); // Prazo
  const [assignedToMe, setAssignedToMe] = useState(false); // Atribuídos para mim
  const [createdByMe, setCreatedByMe] = useState(false); // Criados por mim

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);

  const [isCommentsSheetOpen, setIsCommentsSheetOpen] = useState(false)
  const [selectedTaskForComments, setSelectedTaskForComments] = useState<Tasks | null>(null)

  const handleViewComments = (task: Tasks) => {
    setSelectedTaskForComments(task)
    setIsCommentsSheetOpen(true)
  }

  const handleCloseCommentsSheet = () => {
    setIsCommentsSheetOpen(false)
    setSelectedTaskForComments(null)
  }

  const { data, isLoading, isError, error } = useTasks({ 
    page, 
    size,
    search,
    priority,
    status,
    dueDateRange,
    assignedToMe,
    createdByMe
  });
  const deleteTaskMutation = useDeleteTask();

  const handlePreviousPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => data && page < data.totalPages && setPage(page + 1);

  const handleClearFilters = () => {
    setSearch("");
    setPriority("");
    setStatus("");
    setDueDateRange(""); // 🔹 Limpa o filtro de prazo
    setAssignedToMe(false); // 🔹 Limpa o filtro "Atribuídos para mim"
    setCreatedByMe(false); // 🔹 Limpa o filtro "Criados por mim"
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

  const columns = getColumns({
    onEditTask: handleEditTask,
    onDeleteTask: handleOpenDeleteModal,
    onViewComments: handleViewComments
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Carregando Tasks...
      </div>
    );
  }

  if (isError) {
  return (
    <div className="flex items-center justify-center h-64 text-lg text-red-500">
      {error && 'status' in error && error.status === 429 
        ? 'Muitas requisições, tente novamente em 60 segundos' 
        : 'Não foi possível renderizar a listagem no momento'
      }
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
                  <SelectItem value="TODO">Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                  <SelectItem value="REVIEW">Em Revisão</SelectItem>
                  <SelectItem value="DONE">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔹 NOVO FILTRO: Prazo */}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="dueDate" className="text-sm text-gray-300">
                Prazo
              </Label>
              <Select value={dueDateRange} onValueChange={setDueDateRange}>
                <SelectTrigger className="w-48 bg-[#0B0F19] border-blue-900/40 text-gray-200">
                  <SelectValue placeholder="Todos os prazos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Vence em 5 dias</SelectItem>
                  <SelectItem value="10">Vence em 10 dias</SelectItem>
                  <SelectItem value="15">Vence em 15 dias</SelectItem>
                  <SelectItem value="30">Vence em 30 dias</SelectItem>
                  <SelectItem value="expired">Vencidas</SelectItem>
                  <SelectItem value="no_due_date">Sem prazo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔹 NOVOS FILTROS: Checkboxes */}
            <div className="flex flex-col space-y-3">
              <Label className="text-sm text-gray-300">Filtros Adicionais</Label>
              <div className="flex flex-col space-y-2">
                {/* Atribuídos para mim */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="assignedToMe"
                    checked={assignedToMe}
                    onCheckedChange={(checked) => setAssignedToMe(checked as boolean)}
                    className="border-blue-900/40 data-[state=checked]:bg-blue-600 cursor-pointer"
                  />
                  <Label 
                    htmlFor="assignedToMe" 
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Atribuídos para mim
                  </Label>
                </div>

                {/* Criados por mim */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="createdByMe"
                    checked={createdByMe}
                    onCheckedChange={(checked) => setCreatedByMe(checked as boolean)}
                    className="border-blue-900/40 data-[state=checked]:bg-blue-600 cursor-pointer"
                  />
                  <Label 
                    htmlFor="createdByMe" 
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    Criados por mim
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 hover:bg-transparent cursor-pointer"
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
              className="border-blue-900/40 cursor-pointer"
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
              className="border-blue-900/40 cursor-pointer"
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

      <TaskCommentsSheet
        isOpen={isCommentsSheetOpen}
        onClose={handleCloseCommentsSheet}
        task={selectedTaskForComments}
      />

      {/* <Footer /> */}
    </div>
  );
}