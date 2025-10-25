// components/TaskCommentsSheet.tsx
import { useState, useRef, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, ChevronDown } from "lucide-react"
import { useTaskComments } from "@/hooks/useTaskComments"
import { useCreateComment } from "@/hooks/useCreateComment"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TaskCommentsSheetProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    title: string
  } | null
}

// Hook para obter o userId do usuário logado
function useCurrentUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export function TaskCommentsSheet({ isOpen, onClose, task }: TaskCommentsSheetProps) {
  const [page, setPage] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [allComments, setAllComments] = useState<any[]>([])
  const size = 10
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesTopRef = useRef<HTMLDivElement>(null)
  
  const currentUser = useCurrentUser()
  
  // Use enabled para controlar quando a query deve rodar
  const { data: commentsData, isLoading, refetch } = useTaskComments(
    task?.id || '', 
    page, 
    size,
    {
      enabled: isOpen && !!task?.id // Só busca quando o sheet está aberto e tem task
    }
  )
  
  const createCommentMutation = useCreateComment()

  // Efeito principal para carregar as últimas 10 mensagens quando o sheet abre
  useEffect(() => {
    if (isOpen && task) {
      console.log('Sheet aberto - carregando últimas 10 mensagens para task:', task.id)
      setPage(1)
      setAllComments([])
      setNewComment('')
      
      // Força o refetch para garantir que os dados sejam carregados
      refetch()
    }
  }, [isOpen, task, refetch])

  // Atualiza a lista de comentários quando novos dados chegam
  useEffect(() => {
    console.log('Dados recebidos:', commentsData)
    if (commentsData?.comments && commentsData.comments.length > 0) {
      if (page === 1) {
        // Primeira página - substitui todos os comentários com as últimas mensagens
        console.log('Carregando últimas 10 mensagens:', commentsData.comments.length)
        setAllComments(commentsData.comments)
      } else {
        // Páginas subsequentes - adiciona mensagens mais antigas no início
        console.log('Carregando mensagens mais antigas:', commentsData.comments.length)
        setAllComments(prev => [...commentsData.comments, ...prev])
      }
    }
  }, [commentsData?.comments, page])

  // Scroll para baixo quando as últimas mensagens são carregadas ou novo comentário é adicionado
  useEffect(() => {
    if (page === 1 && allComments.length > 0) {
      console.log('Fazendo scroll para as mensagens mais recentes')
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [allComments.length, page])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !task) return

    try {
      await createCommentMutation.mutateAsync({
        taskId: task.id,
        content: newComment.trim()
      })
      
      setNewComment('')
      // Recarrega os comentários para pegar o novo comentário
      // Reseta para página 1 para ver as mensagens mais recentes
      setPage(1)
      refetch()
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
    }
  }

  const handleLoadMore = () => {
    console.log('Carregando mais mensagens antigas, página atual:', page)
    setPage(prev => prev + 1)
  }

  const hasMoreComments = commentsData && page < commentsData.totalPages

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  const isOwnMessage = (commentUserId: string) => {
    return currentUser?.id === commentUserId
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-[#121620] border-l border-blue-900/30 text-white overflow-hidden flex flex-col">
        <SheetHeader className="border-b border-blue-900/30 pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <div>
              <h2 className="text-lg font-semibold">Comentários da Tarefa</h2>
              <p className="text-sm text-gray-400 font-normal truncate max-w-md">
                {task?.title}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Área de Comentários */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Cabeçalho com Contador */}
          {commentsData && commentsData.total > 0 && (
            <div className="flex items-center justify-between p-4 border-b border-blue-900/20">
              <div className="text-sm text-gray-400">
                {commentsData.total} comentário{commentsData.total !== 1 ? 's' : ''}
              </div>
              {hasMoreComments && (
                <div className="text-sm text-blue-400">
                  {allComments.length} de {commentsData.total} carregados
                </div>
              )}
            </div>
          )}

          {/* Lista de Comentários */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Botão Carregar Mais no Topo */}
            {hasMoreComments && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="border-blue-900/40 text-blue-400 hover:bg-blue-950"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Carregar mensagens mais antigas
                </Button>
              </div>
            )}

            {/* Loading ao carregar mais mensagens */}
            {isLoading && page > 1 && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            )}

            <div ref={messagesTopRef} />

            {/* Lista de Mensagens */}
            <div className="space-y-4">
              {isLoading && page === 1 ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-400">Carregando mensagens...</span>
                </div>
              ) : allComments.length > 0 ? (
                allComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex ${isOwnMessage(comment.userId) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        isOwnMessage(comment.userId)
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-700 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      {/* Header da Mensagem */}
                      <div className={`flex justify-between items-start mb-2 ${
                        isOwnMessage(comment.userId) ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <span className={`text-sm font-medium ${
                          isOwnMessage(comment.userId) ? 'text-blue-100' : 'text-blue-300'
                        }`}>
                          {isOwnMessage(comment.userId) ? 'Você' : comment.userName}
                        </span>
                        <span className={`text-xs ${
                          isOwnMessage(comment.userId) ? 'text-blue-200' : 'text-gray-400'
                        } ${isOwnMessage(comment.userId) ? 'mr-2' : 'ml-2'}`}>
                          {formatMessageTime(comment.createdAt)}
                        </span>
                      </div>

                      {/* Conteúdo da Mensagem */}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : !isLoading ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <p>Nenhum comentário ainda</p>
                  <p className="text-sm">Seja o primeiro a comentar!</p>
                </div>
              ) : null}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Formulário de Novo Comentário */}
          <form onSubmit={handleSubmitComment} className="p-4 border-t border-blue-900/30">
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Digite seu comentário..."
                className="flex-1 bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500"
                disabled={createCommentMutation.isPending || isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim() || createCommentMutation.isPending || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createCommentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}