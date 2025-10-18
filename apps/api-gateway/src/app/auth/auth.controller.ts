import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '@repo/types';

@Controller('api/auth')
export class AuthController {

    constructor(
        @Inject('AUTH-SERVICE') private readonly authClient: ClientProxy,
    ){}

    @Post("login")
    async login(@Body() body: { username: string; password: string }) {
        return await firstValueFrom(this.authClient.send('auth-login', body));
    }

    @Post("register")
    async createdUser(@Body() user: CreateUserDto) {
        return await firstValueFrom(this.authClient.send('create-user', user));
    }
}
