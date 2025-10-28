# Gaming Jungle - Sistema de Gerenciamento de Tarefas

Um sistema completo de gerenciamento de tarefas construído com arquitetura de microserviços, oferecendo uma experiência moderna e escalável para equipes de desenvolvimento.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura de microserviços com os seguintes componentes:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (React/Vite)  │◄──►│   (NestJS)      │◄──►│   (NestJS)      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Tasks Service   │    │ Notifications  │
                       │ (NestJS)        │    │ Service         │
                       │ Port: 3003      │    │ (NestJS)        │
                       └─────────────────┘    │ Port: 3004      │
                                │            └─────────────────┘
                                ▼                        │
                       ┌─────────────────┐                │
                       │   PostgreSQL    │                │
                       │   Database      │                │
                       │   Port: 5432    │                │
                       └─────────────────┘                │
                                                          ▼
                                                ┌─────────────────┐
                                                │   RabbitMQ      │
                                                │   Message       │
                                                │   Broker        │
                                                │   Port: 5672    │
                                                │   Management:   │
                                                │   Port: 15672   │
                                                └─────────────────┘
```

### Componentes Principais

- **Frontend (Web)**: Interface React moderna com Vite, TanStack Router e Query
- **API Gateway**: Ponto de entrada único para todos os serviços
- **Auth Service**: Gerenciamento de autenticação e autorização com JWT
- **Tasks Service**: CRUD completo de tarefas, comentários e histórico
- **Notifications Service**: Sistema de notificações em tempo real via WebSocket
- **PostgreSQL**: Banco de dados principal
- **RabbitMQ**: Message broker para comunicação assíncrona

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca de interface
- **Vite** - Build tool e dev server
- **TanStack Router** - Roteamento type-safe
- **TanStack Query** - Gerenciamento de estado do servidor
- **TanStack Table** - Componente de tabela avançado
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Socket.io Client** - Comunicação em tempo real
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Sistema de notificações toast
- **Lucide React** - Ícones
- **Next Themes** - Gerenciamento de temas
- **Date-fns** - Manipulação de datas

### Backend
- **NestJS** - Framework Node.js para microserviços
- **TypeORM** - ORM para PostgreSQL
- **JWT** - Autenticação stateless
- **bcrypt** - Hash de senhas
- **Socket.io** - WebSockets para notificações
- **RabbitMQ** - Message broker para comunicação assíncrona
- **Swagger/OpenAPI** - Documentação de APIs
- **Class Validator** - Validação de dados
- **Throttler** - Rate limiting no API Gateway

### DevOps & Infraestrutura
- **Docker & Docker Compose** - Containerização
- **Turborepo** - Monorepo management
- **PostgreSQL 17** - Banco de dados
- **RabbitMQ** - Message broker

## 📋 Funcionalidades

### Sistema de Autenticação
- ✅ Login e registro de usuários
- ✅ JWT com refresh tokens
- ✅ Middleware de autenticação
- ✅ Proteção de rotas

### Gerenciamento de Tarefas
- ✅ CRUD completo de tarefas
- ✅ Sistema de prioridades (LOW, MEDIUM, HIGH, URGENT)
- ✅ Estados de tarefa (TODO, IN_PROGRESS, REVIEW, DONE)
- ✅ Atribuição de usuários múltiplos
- ✅ Prazos e deadlines
- ✅ Histórico de alterações
- ✅ Sistema de filtros avançados (busca, prioridade, status, prazo)
- ✅ Paginação de resultados
- ✅ Filtros "Atribuídos para mim" e "Criados por mim"

### Sistema de Comentários
- ✅ Comentários em tarefas
- ✅ Rastreamento de autor
- ✅ Timestamps automáticos

### Notificações
- ✅ Notificações em tempo real via WebSocket
- ✅ Sistema de mensageria com RabbitMQ
- ✅ Histórico de notificações persistido
- ✅ Eventos: criação de tarefa, atualização, comentários
- ✅ Notificações direcionadas por usuário

### Interface do Usuário
- ✅ Landing page moderna com gradientes
- ✅ Dashboard responsivo com filtros avançados
- ✅ Tema escuro padrão
- ✅ Componentes acessíveis (Radix UI)
- ✅ Notificações toast (Sonner)
- ✅ Modais para criação/edição de tarefas
- ✅ Sheet lateral para comentários
- ✅ Sistema de navegação com TanStack Router
- ✅ Formulários com validação (React Hook Form + Zod)

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js >= 18
- Docker e Docker Compose
- npm 10.9.3+

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd challenge-gaming-jungle
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute com Docker Compose**
```bash
docker-compose up --build
```

### Acesso aos Serviços

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3001
- **Auth Service**: http://localhost:3002 (Swagger: http://localhost:3002/api/docs)
- **Tasks Service**: http://localhost:3003 (Swagger: http://localhost:3003/api/docs)
- **Notifications Service**: http://localhost:3004 (Swagger: http://localhost:3004/api/docs)
- **PostgreSQL**: localhost:5432
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)

### Desenvolvimento Local

Para desenvolvimento sem Docker:

```bash
# Instalar dependências
npm install

# Executar todos os serviços
npm run dev

# Ou executar serviços específicos
npx turbo dev --filter=web
npx turbo dev --filter=api-gateway
npx turbo dev --filter=auth-service
npx turbo dev --filter=tasks-service
npx turbo dev --filter=notifications-service
```

**Nota**: Para desenvolvimento local, você precisará ter PostgreSQL e RabbitMQ rodando localmente ou usar Docker apenas para esses serviços:

```bash
# Apenas banco e message broker
docker-compose up db rabbitmq
```

## 🏛️ Decisões Técnicas e Trade-offs

### Arquitetura de Microserviços
**Decisão**: Implementar microserviços separados para Auth, Tasks e Notifications
**Trade-offs**:
- ✅ Escalabilidade independente
- ✅ Tecnologias específicas por domínio
- ✅ Isolamento de falhas
- ❌ Complexidade de comunicação
- ❌ Overhead de rede
- ❌ Gerenciamento de dados distribuídos

### Comunicação RabbitMQ vs HTTP/TCP
**Decisão**: Usar RabbitMQ para comunicação assíncrona entre microserviços
**Trade-offs**:
- ✅ Comunicação assíncrona e confiável
- ✅ Desacoplamento entre serviços
- ✅ Padrão de mensageria estabelecido
- ✅ Suporte a diferentes tipos de eventos
- ❌ Complexidade adicional de infraestrutura
- ❌ Overhead de message broker

### JWT vs Sessions
**Decisão**: Implementar autenticação stateless com JWT
**Trade-offs**:
- ✅ Escalabilidade horizontal
- ✅ Stateless
- ✅ Funciona bem com microserviços
- ❌ Difícil de invalidar tokens
- ❌ Tokens podem ser grandes

### TypeORM vs Prisma
**Decisão**: Usar TypeORM como ORM
**Trade-offs**:
- ✅ Integração nativa com NestJS
- ✅ Decorators TypeScript
- ✅ Migrations automáticas
- ✅ Suporte a relacionamentos complexos
- ❌ Performance pode ser inferior
- ❌ Menos type-safe que Prisma

### Monorepo com Turborepo
**Decisão**: Usar Turborepo para gerenciar o monorepo
**Trade-offs**:
- ✅ Compartilhamento de código
- ✅ Builds incrementais
- ✅ Caching inteligente
- ❌ Complexidade de setup
- ❌ Dependências compartilhadas

## ⚠️ Problemas Conhecidos e Melhorias

### Problemas Atuais

1. **Segurança**
   - Senhas não têm política de complexidade
   - Tokens JWT não têm blacklist
   - Falta validação de entrada mais robusta

2. **Performance**
   - N+1 queries em algumas consultas
   - Falta de cache Redis
   - Sem paginação em listagens
   - Falta de índices otimizados

3. **Observabilidade**
   - Falta de logging estruturado
   - Sem métricas de performance
   - Falta de health checks
   - Sem tracing distribuído

4. **Testes**
   - Cobertura de testes baixa
   - Falta de testes E2E
   - Sem testes de integração
   - Falta de testes de carga

### Melhorias Sugeridas

1. **Curto Prazo**
   - Implementar Redis para cache
   - Adicionar paginação
   - Melhorar validações
   - Adicionar logs estruturados

2. **Médio Prazo**
   - Implementar testes automatizados
   - Adicionar CI/CD pipeline
   - Adicionar health checks

3. **Longo Prazo**
   - Implementar observabilidade completa
   - Adicionar testes de carga
   - Implementar cache distribuído
   - Adicionar backup automático

## ⏱️ Tempo Gasto por Componente

### Estimativa de Desenvolvimento

| Componente | Tempo Estimado | Complexidade |
|------------|----------------|--------------|
| **Setup Inicial** | 4-6 horas | Média |
| - Turborepo setup | 1 hora | Baixa |
| - Docker configuration | 2 horas | Média |
| - TypeScript configs | 1 hora | Baixa |
| **Auth Service** | 8-12 horas | Alta |
| - User entity & migrations | 2 horas | Média |
| - JWT implementation | 3 horas | Alta |
| - Auth guards & middleware | 2 horas | Média |
| - API endpoints | 3 horas | Média |
| **Tasks Service** | 12-16 horas | Alta |
| - Task entity & relationships | 3 horas | Alta |
| - CRUD operations | 4 horas | Média |
| - Comments system | 3 horas | Média |
| - Task history | 2 horas | Média |
| - Business logic | 4 horas | Alta |
| **API Gateway** | 6-8 horas | Média |
| - Service communication | 3 horas | Média |
| - Route proxying | 2 horas | Baixa |
| - Error handling | 2 horas | Média |
| - Auth integration | 1 hora | Baixa |
| **Notifications Service** | 6-10 horas | Média |
| - WebSocket setup | 3 horas | Média |
| - RabbitMQ integration | 3 horas | Alta |
| - Notification logic | 2 horas | Média |
| - Real-time updates | 2 horas | Média |
| **Frontend** | 16-24 horas | Alta |
| - Landing page | 4 horas | Média |
| - Authentication flow | 4 horas | Média |
| - Dashboard & UI | 6 horas | Alta |
| - Task management | 4 horas | Média |
| - Real-time features | 3 horas | Alta |
| - State management | 3 horas | Média |
| **Database & Infrastructure** | 4-6 horas | Média |
| - PostgreSQL setup | 1 hora | Baixa |
| - Migrations | 2 horas | Média |
| - RabbitMQ setup | 1 hora | Baixa |
| - Docker optimization | 2 horas | Média |

**Total Estimado**: 56-82 horas (7-10 dias de trabalho)

## 📚 Instruções Específicas

### Configuração de Ambiente

1. **Variáveis de Ambiente**
```bash
# Auth Service
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=challenge_db

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

2. **Executar Migrations**
```bash
# Auth Service
cd apps/auth-service
npm run typeorm:run-migrations

# Tasks Service
cd apps/tasks-service
npm run typeorm:run-migrations

# Notifications Service
cd apps/notifications-service
npm run typeorm:run-migrations
```

### Credenciais Padrão

- **PostgreSQL**: 
  - Host: localhost:5432
  - Database: challenge_db
  - Username: postgres
  - Password: password

- **RabbitMQ Management**:
  - URL: http://localhost:15672
  - Username: admin
  - Password: admin

### Documentação da API

Todos os serviços possuem documentação Swagger/OpenAPI disponível:

- **Auth Service**: http://localhost:3002/api/docs
- **Tasks Service**: http://localhost:3003/api/docs  
- **Notifications Service**: http://localhost:3004/api/docs

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Todos os serviços
npm run build                  # Build completo
npm run lint                   # Lint todos os projetos
npm run format                 # Formatar código

# Docker
docker-compose up --build      # Subir todos os serviços
docker-compose down            # Parar todos os serviços
docker-compose logs -f web     # Ver logs do frontend

# Turborepo
npx turbo dev --filter=web    # Apenas frontend
npx turbo build --filter=@repo/types  # Build apenas types
```

### Estrutura do Projeto

```
challenge-gaming-jungle/
├── apps/
│   ├── web/                   # Frontend React
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/         # Serviço de autenticação
│   ├── tasks-service/        # Serviço de tarefas
│   └── notifications-service/ # Serviço de notificações
├── packages/
│   ├── types/                # Tipos compartilhados
│   ├── ui/                   # Componentes UI
│   ├── eslint-config/        # Configuração ESLint
│   └── typescript-config/    # Configuração TypeScript
├── docker-compose.yml        # Orquestração de containers
├── turbo.json               # Configuração Turborepo
└── package.json             # Dependências raiz
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido como parte de um desafio técnico, demonstrando habilidades em:
- Arquitetura de microserviços
- Desenvolvimento full-stack
- DevOps e containerização
- Gerenciamento de estado
- Comunicação em tempo real

---

**Nota**: Este é um projeto de demonstração técnica. Para uso em produção, implemente as melhorias de segurança e observabilidade mencionadas na seção de problemas conhecidos.