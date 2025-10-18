import { Injectable } from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import { hashSync as bycryptHshSync } from 'bcrypt';
import { CreateUserDto } from '@repo/types';

@Injectable()
export class UsersService {
    private readonly users: CreateUserDto[] = [
        {
            id: '1',
            name: 'John Doe',
            username: 'johndoe',
            password: 'password123',
            createdAt: new Date()
        }
    ]

    create(newUser: CreateUserDto){
        newUser.id = uuid()
        newUser.password = bycryptHshSync(newUser.password, 10);
        this.users.push(newUser)
        
        return newUser;
    }
}
