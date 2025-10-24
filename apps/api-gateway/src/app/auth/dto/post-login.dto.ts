import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class PostLoginDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  @IsEmail()
  username: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha de acesso' })
  @IsString()
  password: string;
}