import { Body, Controller, Delete, Get, HttpException, Inject, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertCommentDto } from './dto/upsert-comment.dto';
import { Logger } from '@nestjs/common';

const logger = new Logger('RateLimitDebug');

@ApiTags('Tasks - API Gateway')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/tasks')
export class TasksController {
  constructor(
    @Inject('TASKS-SERVICE') private readonly tasksClient: ClientProxy,
  ){}

  @Get()
  @ApiOperation({ 
    summary: 'Listar tarefas', 
    description: 'Lista tarefas com filtros avançados e paginação' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número da página' })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10, description: 'Tamanho da página' })
  @ApiQuery({ name: 'search', required: false, description: 'Termo de busca no título ou descrição' })
  @ApiQuery({ name: 'priority', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], description: 'Filtrar por prioridade' })
  @ApiQuery({ name: 'status', required: false, enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'], description: 'Filtrar por status' })
  @ApiQuery({ name: 'dueDateRange', required: false, description: 'Range de datas no formato YYYY-MM-DD,YYYY-MM-DD' })
  @ApiQuery({ name: 'assignedToMe', required: false, type: Boolean, description: 'Filtrar tarefas atribuídas ao usuário atual' })
  @ApiQuery({ name: 'createdByMe', required: false, type: Boolean, description: 'Filtrar tarefas criadas pelo usuário atual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas retornada com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  async findAll(
    @Req() req,
    @Query('page') page = 1, 
    @Query('size') size = 10, 
    @Query('search') search?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
    @Query('dueDateRange') dueDateRange?: string,
    @Query('assignedToMe') assignedToMe?: string,
    @Query('createdByMe') createdByMe?: string,
  ) {
    try {
      logger.log(`Requisição recebida de IP: ${req.ip}`);
      const userId = req.user.userId;
      
      const filters = {
        page: Number(page) || 1,
        size: Number(size) || 10,
        userId,
        ...(search && { search }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(dueDateRange && { dueDateRange }),
        ...(assignedToMe && { assignedToMe: assignedToMe === 'true' }),
        ...(createdByMe && { createdByMe: createdByMe === 'true' }),
      };

      const tasks$ = this.tasksClient.send('task-list', filters);

      return await firstValueFrom(
        tasks$.pipe(
          catchError((error) => {
            throw new HttpException(
              error.message || 'Erro interno',
              error.status || 500,
            );
          }),
        ),
      );
    } catch (error) {
      console.error('Erro no gateway:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar tarefa', 
    description: 'Busca uma tarefa específica pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa encontrada' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async getTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const task$ = this.tasksClient.send('task-get', id);
    return await firstValueFrom(task$);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Criar tarefa', 
    description: 'Cria uma nova tarefa no sistema' 
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarefa criada com sucesso' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    try {
      const userId = req.user.userId;
      const name = req.user.name;
      const task$ = this.tasksClient.send('task-create', { 
        dto: createTaskDto, 
        userId,
        name
      });
      return await firstValueFrom(
        task$.pipe(
          catchError(err => {
            const error = err?.error || err;
            throw new HttpException(
              error.message || 'Erro interno',
              error.status || 500
            );
          })
        )
      );
    } catch (error) {
      console.error('Erro no gateway:', error);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar tarefa', 
    description: 'Atualiza uma tarefa existente' 
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa atualizada com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTaskDto: UpdateTaskDto, 
    @Req() req) {
      try {
        const userId = req.user.userId;
        const task$ = this.tasksClient.send('task-update', { 
          id, 
          dto: updateTaskDto, 
          userId 
        });
        return await firstValueFrom(
          task$.pipe(
            catchError(err => {
              const error = err?.error || err;
              throw new HttpException(
                error.message || 'Erro interno',
                error.status || 500
              );
            })
          )
        );
      } catch (error) {
        console.error('Erro no gateway:', error);
        throw error;
      }
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir tarefa', 
    description: 'Exclui uma tarefa pelo ID' 
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa excluída com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async deleteTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const result$ = this.tasksClient.send('task-delete', id);
    return await firstValueFrom(result$);
  }

  @Post(':id/comments')
  @ApiOperation({ 
    summary: 'Adicionar comentário', 
    description: 'Adiciona um comentário a uma tarefa' 
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpsertCommentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentário criado com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async createComment(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() createCommentDto: UpsertCommentDto, 
    @Req() req) {
      try {
        const user = {
          id: req.user.userId,
          username: req.user.username,
          name: req.user.name,
        };
        const comment$ = this.tasksClient.send('comment-create', { 
          taskId: id,
          dto: createCommentDto, 
          user
        });
        return await firstValueFrom(
          comment$.pipe(
            catchError(err => {
              const error = err?.error || err;
              throw new HttpException(
                error.message || 'Erro interno',
                error.status || 500
              );
            })
          )
        );
      } catch (error) {
        console.error('Erro no gateway:', error);
        throw error;
      }
  }

  @Put(':id/comments')
  @ApiOperation({ 
    summary: 'Atualizar comentário', 
    description: 'Atualiza um comentário existente' 
  })
  @ApiParam({ name: 'id', description: 'UUID do comentário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpsertCommentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Comentário atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comentário não encontrado' 
  })
  async updateComment(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCommentDto: UpsertCommentDto, 
    @Req() req) {
      try {
        const comment$ = this.tasksClient.send('comment-update', { 
          id: id,
          dto: updateCommentDto, 
          userId: req.user.userId
        });
        return await firstValueFrom(
          comment$.pipe(
            catchError(err => {
              const error = err?.error || err;
              throw new HttpException(
                error.message || 'Erro interno',
                error.status || 500
              );
            })
          )
        );
      } catch (error) {
        console.error('Erro no gateway:', error);
        throw error;
      }
  }

  @Get(':id/comments')
  @ApiOperation({ 
    summary: 'Listar comentários', 
    description: 'Lista comentários de uma tarefa com paginação' 
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número da página' })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10, description: 'Tamanho da página (máximo 100)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de comentários retornada com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  async findTaskComments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Req() req
  ) {
    try {
      const pageNumber = Math.max(1, Number(page));
      const sizeNumber = Math.max(1, Math.min(Number(size), 100));

      const comments$ = this.tasksClient.send('comment-find-all', {
        taskId: id,
        page: pageNumber,
        size: sizeNumber,
      });

      return await firstValueFrom(
        comments$.pipe(
          catchError((error) => {
            throw new HttpException(
              error.message || 'Erro interno',
              error.status || 500,
            );
          }),
        ),
      );
    } catch (error) {
      console.error('Erro no gateway:', error);
      throw error;
    }
  }
}