import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@repo/types';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern("create-user")
      async createdUser(@Payload() user: CreateUserDto) {
        return await this.usersService.create(user);
      }
}
