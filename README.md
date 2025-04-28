# Cursos Online DIF

Este projeto foi desenvolvido por alunos da Faculdade de Tecnologia de Votorantim, ministrado pelo Professor Mestre Ricardo Leme através da disciplina Banco de Dados Não Relacional do curso Desenvolvimento de Software Multiplataforma, turma do 3 Semestre de 2025.

## Alunos

- Douglas Wenzel
- Fernando Chibli
- Isabel Maito

## O Projeto

Este projeto se refere à uma API RESTful de administração de cursos online onde há um sistema de armazenamento de cursos. Essa API foi desenvolvida em Node e MongoDB para estocagem de criação de novos cursos e atualizações.

### Estrutura do projeto

```bash
dif-cursos/                       # Raiz do projeto
│
├── api/                          # Código-fonte da API backend
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

## Vercel

[Link da API no Vercel](https://dif-cursos.vercel.app)
