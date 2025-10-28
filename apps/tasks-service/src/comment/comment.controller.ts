import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

export class CreateCommentDto {
  content: string;
}

export class UpdateCommentDto {
  content: string;
}

@ApiTags('Comments Service - Microservice')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  
  @MessagePattern('comment-create')
  @ApiOperation({ 
    summary: 'Criar comentário', 
    description: 'Adiciona um comentário a uma tarefa' 
  })
  @ApiParam({ name: 'taskId', description: 'ID da tarefa' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentário criado com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async createTask(@Payload() data: { taskId: string; dto: CreateCommentDto; user: { id: string; username: string; name: string } }) {
    return this.commentService.create(data.taskId, data.dto, data.user);
  }
  
  @MessagePattern('comment-update')
  @ApiOperation({ 
    summary: 'Atualizar comentário', 
    description: 'Atualiza um comentário existente' 
  })
  @ApiParam({ name: 'id', description: 'ID do comentário' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Comentário atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comentário não encontrado' 
  })
  async updateTask(@Payload() data: { id: string; dto: UpdateCommentDto; userId: string }) {
    return this.commentService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern('comment-find-all')
  @ApiOperation({ 
    summary: 'Listar comentários', 
    description: 'Lista comentários de uma tarefa com paginação' 
  })
  @ApiParam({ name: 'taskId', description: 'ID da tarefa' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Tamanho da página' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de comentários retornada com sucesso' 
  })
  async findAllByTaskId(@Payload() data: { taskId: string; page: number; size: number }) {
    return this.commentService.findAllByTaskId(data.taskId, data.page, data.size);
  }
}