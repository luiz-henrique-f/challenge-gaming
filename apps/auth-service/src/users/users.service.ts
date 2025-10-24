import { ConflictException, Injectable } from '@nestjs/common';
import { hashSync as bycryptHshSync } from 'bcrypt';
import { CreateUserDto } from '@repo/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ){}

    async create(newUser: CreateUserDto){
        const userAlreadyRegistered = await this.findByUserName(newUser.username);

        if(userAlreadyRegistered){
            throw new ConflictException(`Usuário '${newUser.username}' já existe no sistema.`);
        }

        const dbUser = new UserEntity();
        dbUser.name = newUser.name;
        dbUser.username = newUser.username;
        dbUser.password = bycryptHshSync(newUser.password, 10);

        const { id, name, username } = await this.usersRepository.save(dbUser);

        return { id, name, username };
    }

    async findByUserName(username: string): Promise<CreateUserDto | null> {
        const userFound = await this.usersRepository.findOne({
            where: { username }
        })

        if(!userFound){
            return null;
        }

        return {
            id: userFound?.id!,
            name: userFound?.name!,
            username: userFound?.username!,
            password: userFound?.password!
        }
    }

    async update(userId: string, hashedRefreshToken: string) {
        await this.usersRepository.update(userId, { hashedRefreshToken });
    }

    async findById(userId: string) {
        const userFound =  await this.usersRepository.findOne({
            where: { id: userId }
        });

        if(!userFound){
            return null;
        }

        return {
            id: userFound?.id!,
            name: userFound?.name!,
            username: userFound?.username!,
            password: userFound?.password!,
            hashedRefreshToken: userFound?.hashedRefreshToken
        }
    }
}
