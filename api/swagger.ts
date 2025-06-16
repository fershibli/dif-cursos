import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DIF Cursos API",
    version: "1.0.0",
    description: "API RESTful para administração de cursos online",
    contact: {
      name: "Equipe DIF",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Servidor de Desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Curso: {
        type: "object",
        required: [
          "titulo",
          "instrutor",
          "categoria",
          "duracao_horas",
          "alunos_matriculados",
          "data_lancamento",
          "preco",
          "modulos",
        ],
        properties: {
          _id: {
            type: "string",
            description: "ID do curso",
          },
          titulo: {
            type: "string",
            description: "Título do curso",
          },
          instrutor: {
            type: "string",
            description: "Nome do instrutor",
          },
          categoria: {
            type: "string",
            description: "Categoria do curso",
          },
          duracao_horas: {
            type: "number",
            description: "Duração do curso em horas",
          },
          alunos_matriculados: {
            type: "integer",
            description: "Número de alunos matriculados",
          },
          data_lancamento: {
            type: "string",
            format: "date",
            description: "Data de lançamento do curso",
          },
          preco: {
            type: "number",
            description: "Preço do curso",
          },
          avaliacao: {
            type: "number",
            description: "Avaliação do curso (0-5)",
          },
          modulos: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Lista de módulos do curso",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./api/routes/*.ts"], // Caminhos para os arquivos com anotações JSDoc
};

export default swaggerJSDoc(options);
