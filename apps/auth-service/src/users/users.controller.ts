import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export class CreateUserDto {
  id: string;
  name: string;
  username: string;
  password: string;
}

@ApiTags('Users Service - Microservice')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('find-all-users')
  @ApiOperation({ 
    summary: 'Listar todos os usuários', 
    description: 'Retorna uma lista de todos os usuários cadastrados' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso' 
  })
  async findAllUsers() {
    return await this.usersService.findAll();
  }

  @MessagePattern('create-user')
  @ApiOperation({ 
    summary: 'Criar usuário', 
    description: 'Cria um novo usuário no sistema' 
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
  async createdUser(@Payload() user: CreateUserDto) {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      throw new RpcException({
        status: error.status || 500,
        message: error.message || 'Erro interno no servidor'
      });
    }
  }
}