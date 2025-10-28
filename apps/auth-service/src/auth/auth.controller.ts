import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

export class LoginCredentialsDto {
  username: string;
  password: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}

@ApiTags('Auth Service - Microservice')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login-user')
  @ApiOperation({ 
    summary: 'Login do usuário', 
    description: 'Autentica um usuário e retorna tokens de acesso' 
  })
  @ApiBody({ type: LoginCredentialsDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas' 
  })
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

  @MessagePattern('validate-token')
  @ApiOperation({ 
    summary: 'Validar token', 
    description: 'Valida um token JWT' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido ou expirado' 
  })
  async validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }

  @MessagePattern('refresh-token')
  @ApiOperation({ 
    summary: 'Refresh token', 
    description: 'Gera novos tokens usando um refresh token válido' 
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens atualizados com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido' 
  })
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