import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from '@repo/types';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern("create-user")
      async createdUser(@Payload() user: CreateUserDto) {
        try {
            return await this.usersService.create(user);;
        } catch (error) {
            // Propaga a exceção de forma que o client proxy possa entender
            throw new RpcException({
                status: error.status || 500,
                message: error.message || 'Erro interno no servidor'
            });
        }

                console.log('aqui')
        // return await this.usersService.create(user);
      }
}
