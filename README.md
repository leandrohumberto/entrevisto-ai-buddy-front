# Entrevisto AI Buddy - Frontend

Bem-vindo ao Entrevisto AI Buddy, sua ferramenta de IA para gerar roteiros de entrevista de emprego de forma rápida e eficiente.

## ✨ Visão Geral

Esta aplicação web, construída com React e Vite, permite que recrutadores e gerentes de contratação criem e gerenciem vagas de emprego. Com base nos detalhes da vaga, a IA gera roteiros de entrevista personalizados, incluindo perguntas técnicas e comportamentais, ajudando a otimizar o processo de seleção.

## 🚀 Tecnologias Utilizadas

- **[React](https://react.dev/)** - Biblioteca principal para a construção da interface de usuário.
- **[Vite](https://vitejs.dev/)** - Ferramenta de build para um desenvolvimento frontend rápido.
- **[TypeScript](https://www.typescriptlang.org/)** - Para um código mais robusto e seguro.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS para estilização.
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI prontos para uso.
- **[Supabase](https://supabase.io)** - Para autenticação de usuários (login, signup).

## ⚙️ Configuração e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Bun](https://bun.sh/) (gerenciador de pacotes)

### 1. Instalação
Clone o repositório e instale as dependências:

```bash
git clone https://github.com/leandrohumberto/entrevisto-ai-buddy-front.git
cd entrevisto-ai-buddy-front
bun install
```

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente, substituindo pelos valores do seu projeto Supabase e do seu backend local:

```env
# URL do seu projeto Supabase
VITE_SUPABASE_URL="https://SEU_PROJETO.supabase.co"

# Chave anônima (pública) do seu projeto Supabase
VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON"

# URL base da sua API backend
VITE_API_BASE_URL="http://localhost:5186"
```

### 3. Executando a Aplicação
Para iniciar o servidor de desenvolvimento, execute:

```bash
bun dev
```

A aplicação estará disponível em `http://localhost:8080`.

## 🔗 Backend

Esta aplicação frontend consome uma API .NET para todas as operações de dados (CRUD de vagas) e para a geração dos roteiros de entrevista. Para mais detalhes sobre a API, consulte o repositório do backend:

[**Repositório do Backend (Entrevisto AI Buddy - Backend)**](https://github.com/leandrohumberto/entrevisto-ai-buddy-back)