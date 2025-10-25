// schemas/authSchema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

  username: z.email('Digite um e-mail válido')
    .min(1, 'E-mail é obrigatório')
    .max(255, 'E-mail deve ter no máximo 255 caracteres'),

  password: z.string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(32, 'A senha deve ter no máximo 32 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),
})

export type RegisterFormData = z.infer<typeof registerSchema>