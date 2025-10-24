import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'joaosilva', description: 'Nome de usuário' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  @IsEmail()
  username: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha de acesso' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(32, { message: 'A senha deve ter no máximo 32 caracteres' })
  password: string;
}