import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do usuário (utilizado como username)',
    format: 'email'
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(255, { message: 'O e-mail deve ter no máximo 255 caracteres' })
  username: string;

  @ApiProperty({
    example: 'SenhaSegura123!',
    description: 'Senha de acesso (mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais)',
    minLength: 8,
    maxLength: 32
  })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(32, { message: 'A senha deve ter no máximo 32 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial' 
    }
  )
  password: string;
}