import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { PostLoginDto } from './dto/post-login.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@ApiTags('Auth - API Gateway')
@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('AUTH-SERVICE') private readonly authClient: ClientProxy,
  ){}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ 
    summary: 'Login', 
    description: 'Realiza login no sistema e retorna tokens de acesso' 
  })
  @ApiBody({ type: PostLoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas' 
  })
  async login(@Body() body: PostLoginDto) {
    try {
      return await firstValueFrom(
        this.authClient.send('login-user', body).pipe(
          catchError(error => {
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

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar usuário', 
    description: 'Cria uma nova conta de usuário' 
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Usuário já existe' 
  })
  async createdUser(@Body() user: CreateUserDto) {
    try {
      return await firstValueFrom(
        this.authClient.send('create-user', user).pipe(
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @ApiOperation({ 
    summary: 'Refresh Token', 
    description: 'Renova os tokens de acesso usando um refresh token válido' 
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens renovados com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido' 
  })
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      return await firstValueFrom(
        this.authClient.send('refresh-token', body.refreshToken).pipe(
          catchError(err => {
            const error = err?.error || err;
            throw new HttpException(
              error.message || 'Erro interno',
              error.status || 500
            );
          })
        ),
      );
    } catch (error) {
      console.error('Erro no gateway (refresh-token):', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Listar usuários', 
    description: 'Lista todos os usuários do sistema (requer autenticação)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Não autorizado' 
  })
  async findAllUsers() {
    try {
      return await firstValueFrom(
        this.authClient.send('find-all-users', {}).pipe(
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
}