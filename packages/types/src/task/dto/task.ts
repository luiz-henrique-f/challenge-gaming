// packages/types/src/task.ts
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface CreateTaskDto {
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  assignedUserIds: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: string[];
}

export interface CreateCommentDto {
  content: string;
  // taskId: string; // ID da tarefa à qual o comentário pertence
}

export interface UpdateCommentDto {
  content: string;
}


export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
  assignedUserIds: string[];
  createdAt: Date;
  updatedAt: Date;
  commentCount?: number;
}

export interface CommentResponse {
  id: string;
  content: string;
  userId: string;
  userEmail: string;
  userName: string;
  taskId: string;
  createdAt: Date;
}

export interface CreateTaskHistoryDto {
  taskId: string;
  userId: string;
  action: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export interface TaskHistoryResponse {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  description: string;
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  createdAt: Date;
}