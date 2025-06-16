# Cursos Online DIF

Este projeto foi desenvolvido por alunos da Faculdade de Tecnologia de Votorantim, ministrado pelo Professor Mestre Ricardo Leme através da disciplina Banco de Dados Não Relacional do curso Desenvolvimento de Software Multiplataforma, turma do 3 Semestre de 2025.

## Alunos

-   Douglas Wenzel
-   Fernando Chibli
-   Isabel Maito

## O Projeto

Este projeto se refere à uma API RESTful de administração de cursos online onde há um sistema de armazenamento de cursos. Essa API foi desenvolvida em Node e MongoDB para estocagem de criação de novos cursos e atualizações.

### Vercel Live Demo

[Link da API no Vercel](https://dif-cursos.vercel.app)

### Estrutura do projeto

```bash
dif-cursos/                       # Raiz do projeto
│
├── api/                          # Código-fonte da API backend
│   ├── controllers/              # Controladores da API
│   │   ├── cursoController.ts    # Lógica de controle dos cursos
│   ├── routes/                   # Rotas da API
│   │   ├── cursoRoutes.ts        # Definição das rotas de cursos
│   ├── db.ts                     # Conexão com o banco de dados MongoDB
│   ├── server.ts                 # Servidor Express e rotas da API
│   └── types.ts                  # Tipos TypeScript usados na API
│
├── public/                       # Arquivos estáticos do frontend
│   ├── index.html                # Página principal HTML
│   ├── script.js                 # Lógica JavaScript do frontend
│   └── style.css                 # Estilos CSS do frontend
│
├── .gitignore                    # Arquivos e pastas ignorados pelo Git
├── package.json                  # Configurações e dependências do Node.js
├── README.md                     # Documentação do projeto
├── tsconfig.json                 # Configuração do TypeScript
└── vercel.json                   # Configuração de deploy na Vercel
```

## Stacks

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

# Chamadas REST

### GET /api/cursos

Retorna todos os cursos cadastrados.

**Resposta:**

-   200: Array de cursos
-   500: Erro ao buscar cursos

### GET /api/cursos/search?busca=...

Busca rápida de cursos por título, instrutor ou categoria.

**Query Params:**

-   `busca` (string, opcional): termo de busca

**Resposta:**

-   200: Array de cursos encontrados
-   500: Erro na busca rápida

### GET /api/cursos/:id

Busca um curso pelo seu ID.

**Params:**

-   `id` (string): ID do curso

**Resposta:**

-   200: Objeto do curso
-   404: Curso não encontrado
-   500: Erro ao buscar curso

### GET /api/cursos/search/advanced

Busca avançada de cursos com múltiplos filtros.

**Query Params (todos opcionais):**

-   `minPreco` (float): Preço mínimo
-   `maxPreco` (float): Preço máximo
-   `categoria` (string): Categoria do curso
-   `minDuracao` (float): Duração mínima (horas)
-   `minAvaliacao` (float): Avaliação mínima (0-5)
-   `tituloOuInstrutor` (string): Busca por título ou instrutor

**Resposta:**

-   200: Array de cursos filtrados
-   400: Erro de validação dos filtros
-   500: Erro na busca avançada

### POST /api/cursos

Cria um novo curso.

**Body (JSON):**

-   `titulo` (string, obrigatório)
-   `instrutor` (string, obrigatório)
-   `categoria` (string, obrigatório)
-   `duracao_horas` (float, obrigatório)
-   `alunos_matriculados` (int, obrigatório)
-   `data_lancamento` (ISO date, obrigatório)
-   `preco` (float, obrigatório)
-   `avaliacao` (float, opcional, 0-5)
-   `modulos` (array de string, obrigatório)

**Resposta:**

-   201: Curso criado
-   400: Erro de validação
-   500: Erro ao criar curso

### PUT /api/cursos/:id

Atualiza um curso existente.

**Params:**

-   `id` (string): ID do curso

**Body (JSON):**
Mesmos campos do POST.

**Resposta:**

-   200: Curso atualizado
-   404: Curso não encontrado
-   400: Erro de validação
-   500: Erro ao atualizar curso

### DELETE /api/cursos/:id

Remove um curso pelo ID.

**Params:**

-   `id` (string): ID do curso

**Resposta:**

-   200: Curso excluído com sucesso
-   404: Curso não encontrado
-   500: Erro ao excluir curso
