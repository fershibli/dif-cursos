import express from "express";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import cursoRoutes from "./routes/cursos.routes";
import usuarioRoutes from "./routes/usuarios.routes";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}
console.log("Variáveis de ambiente carregadas com sucesso");
console.log("Ambiente:", process.env.ENVIRONMENT);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para obter o JSON do Swagger
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/cursos", cursoRoutes);

const isServerless = process.env.ENVIRONMENT !== "development";

// run on 3000
if (!isServerless) {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
