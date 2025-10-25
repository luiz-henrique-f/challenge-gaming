import { Body, Controller, Delete, Get, HttpException, Inject, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/guards/auth/auth.guard';
// import type { CreateCommentDto, UpdateCommentDto } from '@repo/types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertCommentDto } from './dto/upsert-comment.dto';

@Controller('api/tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(
        @Inject('TASKS-SERVICE') private readonly tasksClient: ClientProxy,
    ){}

    @Get()
  async findAll(@Query('page') page = 1, @Query('size') size = 10, @Req() req) {
    try {
      const userId = req.user.userId;
      const tasks$ = this.tasksClient.send('task-list', { page, size });

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
        async getTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
            const task$ = this.tasksClient.send('task-get', id);
            return await firstValueFrom(task$);
        }

    @Post()
        async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req) {
                try {
                    const userId = req.user.userId;
                    const task$ = this.tasksClient.send('task-create', { 
                    dto: createTaskDto, 
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

    @Put(':id')
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
            // return await firstValueFrom(task$);
    }

    @Delete(':id')
        async deleteTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
            const result$ = this.tasksClient.send('task-delete', id);
            return await firstValueFrom(result$);
        }

    @Post(':id/comments')
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
            
            // return await firstValueFrom(comment$);
        }

    @Put(':id/comments')
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
    async findTaskComments(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 10,
        @Req() req
    ) {
        try {
            const pageNumber = Math.max(1, Number(page));
            const sizeNumber = Math.max(1, Math.min(Number(size), 100)); // Limita a 100 por página

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
