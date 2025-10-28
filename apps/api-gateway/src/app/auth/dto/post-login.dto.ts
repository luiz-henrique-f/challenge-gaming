import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class PostLoginDto {
  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do usuário cadastrado',
    format: 'email'
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(255, { message: 'O e-mail deve ter no máximo 255 caracteres' })
  username: string;

  @ApiProperty({
    example: 'SenhaSegura123!',
    description: 'Senha de acesso',
    minLength: 8,
    maxLength: 32
  })
  @IsString()
  @MinLength(1, { message: 'A senha é obrigatória' })
  password: string;
}