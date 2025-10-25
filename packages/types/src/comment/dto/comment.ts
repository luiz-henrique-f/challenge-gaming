export interface Comment {
  id: string
  content: string
  userId: string
  taskId: string
  userEmail: string
  userName: string
  createdAt: string
  updatedAt: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  page: number
  size: number
  totalPages: number
}

export interface CreateCommentsDto {
  content: string
  taskId: string
}