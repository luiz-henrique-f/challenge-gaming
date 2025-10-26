import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
// import { CreateCommentDto, UpdateCommentDto } from '@repo/types';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

export class CreateCommentDto {
  content: string;
}

export class UpdateCommentDto {
  content: string;
}

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  
  @MessagePattern('comment-create')
  async createTask(@Payload() data: { taskId: string; dto: CreateCommentDto; user: { id: string; username: string; name: string } }) {
    return this.commentService.create(data.taskId, data.dto, data.user);
  }
  
  @MessagePattern('comment-update')
  async updateTask(@Payload() data: { id: string; dto: UpdateCommentDto; userId: string }) {
    return this.commentService.update(data.id, data.dto, data.userId);
  }

   @MessagePattern('comment-find-all')
   async findAllByTaskId(@Payload() data: { taskId: string; page: number; size: number }) {
    return this.commentService.findAllByTaskId(data.taskId, data.page, data.size);
  }
}
