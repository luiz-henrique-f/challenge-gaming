import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('api/tasks')
export class TasksController {
    constructor(
        @Inject('TASKS-SERVICE') private readonly authClient: ClientProxy,
    ){}
    @UseGuards(AuthGuard)
    @Get()
    async getUserProfile(@Req() req) {
        const userId = req.user.userId;
        const user$ = this.authClient.send('get-user-profile', userId);
        return await firstValueFrom(user$);
    }
}
