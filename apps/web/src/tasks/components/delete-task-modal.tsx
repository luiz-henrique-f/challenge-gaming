// components/DeleteTaskModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { Tasks } from './table-columns'

interface DeleteTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  task: Tasks | null
  isDeleting: boolean
}

export function DeleteTaskModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  task, 
  isDeleting 
}: DeleteTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#121620] border border-red-900/30 rounded-xl shadow-lg text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-red-400">Excluir Tarefa</DialogTitle>
              <DialogDescription className="text-gray-400 mt-1">
                Esta ação não pode ser desfeita
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300">
            Tem certeza que deseja excluir a tarefa <strong>"{task?.title}"</strong>?
          </p>
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-300">
              <strong>Atenção:</strong> Todos os dados desta tarefa serão permanentemente removidos do sistema.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="border-gray-600 hover:bg-gray-700  cursor-pointer text-black"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Excluir Tarefa
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}