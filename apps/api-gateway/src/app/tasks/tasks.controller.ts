import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import type { CreateCommentDto, CreateTaskDto, UpdateCommentDto, UpdateTaskDto } from '@repo/types';

@Controller('api/tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(
        @Inject('TASKS-SERVICE') private readonly tasksClient: ClientProxy,
    ){}

    @Get(':id')
        async getTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
            const task$ = this.tasksClient.send('task-get', id);
            return await firstValueFrom(task$);
        }

    @Post()
        async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req) {
            const userId = req.user.userId;
            const task$ = this.tasksClient.send('task-create', { 
            dto: createTaskDto, 
            userId 
            });
            return await firstValueFrom(task$);
        }

    @Put(':id')
        async updateTask(
            @Param('id', ParseUUIDPipe) id: string, 
            @Body() updateTaskDto: UpdateTaskDto, 
            @Req() req) {
            const userId = req.user.userId;
            const task$ = this.tasksClient.send('task-update', { 
            id, 
            dto: updateTaskDto, 
            userId 
            });
            return await firstValueFrom(task$);
    }

    @Delete(':id')
        async deleteTask(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
            const result$ = this.tasksClient.send('task-delete', id);
            return await firstValueFrom(result$);
        }

    @Post(':id/comments')
        async createComment(
            @Param('id', ParseUUIDPipe) id: string, 
            @Body() createCommentDto: CreateCommentDto, 
            @Req() req) {
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
            return await firstValueFrom(comment$);
        }

    @Put(':id/comments')
        async updateComment(
            @Param('id', ParseUUIDPipe) id: string, 
            @Body() updateCommentDto: UpdateCommentDto, 
            @Req() req) {
            const comment$ = this.tasksClient.send('comment-update', { 
            id: id,
            dto: updateCommentDto, 
            userId: req.user.userId
            });
            return await firstValueFrom(comment$);
        }
}
