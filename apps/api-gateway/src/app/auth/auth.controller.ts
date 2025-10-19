import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateUserDto } from '@repo/types';

@Controller('api/auth')
export class AuthController {

    constructor(
        @Inject('AUTH-SERVICE') private readonly authClient: ClientProxy,
    ){}

    // @Post("login")
    // async login(@Body() body: { username: string; password: string }) {
    //     return await firstValueFrom(this.authClient.send('auth-login', body));
    // }
    
    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() body: { username: string; password: string }) {
        try {
            return await firstValueFrom(
                this.authClient.send('login-user', body).pipe(
                    catchError(error => {
                        // Transforma o erro RPC em um erro HTTP
                        throw new HttpException(
                            error.message || 'Erro interno',
                            error.status || 500
                        );
                    })
                )
            );
        } catch (error) {
            // Log para debugging
            console.error('Erro no gateway:', error);
            throw error;
        }
    }

    @Post("register")
    async createdUser(@Body() user: CreateUserDto) {
        try {
            return await firstValueFrom(
                this.authClient.send('create-user', user).pipe(
                    catchError(error => {
                        // Transforma o erro RPC em um erro HTTP
                        throw new HttpException(
                            error.message || 'Erro interno',
                            error.status || 500
                        );
                    })
                )
            );
        } catch (error) {
            // Log para debugging
            console.error('Erro no gateway:', error);
            throw error;
        }
        // return await firstValueFrom(this.authClient.send('create-user', user));
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
        async refreshToken(@Body() body: { refreshToken: string }) {
            try {
                return await firstValueFrom(
                    this.authClient.send('refresh-token', body.refreshToken).pipe(
                    catchError((error) => {
                        throw new HttpException(
                        error.message || 'Erro interno',
                        error.status || 500,
                        );
                    }),
                    ),
                );
            } catch (error) {
                console.error('Erro no gateway (refresh-token):', error);
                throw error;
            }
    }
}
