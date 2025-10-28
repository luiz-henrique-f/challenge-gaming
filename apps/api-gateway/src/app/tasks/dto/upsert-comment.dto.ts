import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpsertCommentDto {
  @ApiProperty({
    example: 'Precisamos revisar a implementação do módulo de autenticação antes de prosseguir.',
    description: 'Conteúdo do comentário',
    minLength: 1,
    maxLength: 2000
  })
  @IsNotEmpty({ message: 'O conteúdo do comentário é obrigatório' })
  @IsString()
  @MinLength(1, { message: 'O comentário não pode estar vazio' })
  @MaxLength(2000, { message: 'O comentário deve ter no máximo 2000 caracteres' })
  content: string;
}

// Versão opcional para updates (se necessário)
export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Precisamos revisar a implementação do módulo de autenticação antes de prosseguir com as próximas etapas.',
    description: 'Novo conteúdo do comentário',
    minLength: 1,
    maxLength: 2000
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'O comentário não pode estar vazio' })
  @MaxLength(2000, { message: 'O comentário deve ter no máximo 2000 caracteres' })
  content?: string;
}