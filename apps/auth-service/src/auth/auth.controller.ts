import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
// import { AuthResponseDto } from '@repo/types';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @MessagePattern("login-user")
      async login(@Payload() credential: { username: string; password: string }) {
        try {
            return await this.authService.signIn(credential);
        } catch (error) {
            throw new RpcException({
                status: error.status || 500,
                message: error.message || 'Erro interno no servidor'
            });
        }
      }

    @MessagePattern("validate-token")
        async validateToken(@Payload() token: string) {
            return this.authService.validateToken(token);
    }

    @MessagePattern('refresh-token')
        async refreshToken(@Payload() refreshToken: string) {
            try {
                return await this.authService.refreshTokens(refreshToken);
            } catch (error) {
                throw new RpcException({
                    status: error.status || 401,
                    message: error.message || 'Refresh token inválido',
                });
            }
    }

}
