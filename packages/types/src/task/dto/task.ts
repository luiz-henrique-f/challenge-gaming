export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export class CreateTaskDto {
  title: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigned_user_ids?: string[];
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: string[];
}

export class CreateCommentDto {
  content: string;
  // taskId: string; // ID da tarefa à qual o comentário pertence
}

export class UpdateCommentDto {
  content: string;
}


export class TaskResponse {
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