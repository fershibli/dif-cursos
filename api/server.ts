import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { body, param, query, validationResult } from "express-validator";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://dodowenzel:MBSKOnW8UipvlYYH@cursos-online.oz1cz2p.mongodb.net/cursosdb?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "../public")));
}

let cachedDb: any = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db("cursos_db");
  return cachedDb;
}

const validateCourse = [
  body("titulo").notEmpty().withMessage("Título é obrigatório"),
  body("instrutor").notEmpty().withMessage("Instrutor é obrigatório"),
  body("categoria").notEmpty().withMessage("Categoria é obrigatória"),
  body("duracao_horas")
    .isFloat({ min: 0 })
    .withMessage("Duração deve ser um número positivo"),
  body("alunos_matriculados")
    .isInt({ min: 0 })
    .withMessage("Alunos matriculados deve ser um inteiro positivo"),
  body("data_lancamento")
    .isISO8601()
    .withMessage("Data de lançamento inválida"),
  body("preco").isFloat({ min: 0 }).withMessage("Preço inválido"),
  body("avaliacao")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Avaliação deve ser entre 0 e 5"),
  body("modulos")
    .isArray({ min: 1 })
    .withMessage("Deve conter pelo menos 1 módulo"),
  (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

app.get("/api/cursos", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const cursos = await db.collection("cursos").find({}).toArray();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cursos", error });
  }
});

app.get("/api/cursos/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const curso = await db.collection("cursos").findOne({
      _id: new ObjectId(req.params.id),
    });
    curso ? res.json(curso) : res.status(404).json({ message: "Curso não encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar curso", error });
  }
});

app.get("/api/cursos/search/advanced", [
  query("minPreco").optional().isFloat(),
  query("maxPreco").optional().isFloat(),
  query("categoria").optional().isString(),
  query("minDuracao").optional().isFloat(),
  query("minAvaliacao").optional().isFloat({ min: 0, max: 5 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const db = await connectToDatabase();
    const query: any = {};

    if (req.query.minPreco || req.query.maxPreco) {
      query.preco = {};
      if (req.query.minPreco) query.preco.$gte = Number(req.query.minPreco);
      if (req.query.maxPreco) query.preco.$lte = Number(req.query.maxPreco);
    }

    if (req.query.categoria) query.categoria = req.query.categoria;
    if (req.query.minDuracao) query.duracao_horas = { $gte: Number(req.query.minDuracao) };
    if (req.query.minAvaliacao) query.avaliacao = { $gte: Number(req.query.minAvaliacao) };

    const cursos = await db.collection("cursos").find(query).toArray();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: "Erro na busca avançada", error });
  }
});

app.post("/api/cursos", validateCourse, async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const curso = {
      ...req.body,
      data_lancamento: new Date(req.body.data_lancamento),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("cursos").insertOne(curso);
    res.status(201).json({ ...curso, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar curso", error });
  }
});

app.put("/api/cursos/:id", validateCourse, async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const updateData = {
      ...req.body,
      data_lancamento: new Date(req.body.data_lancamento),
      updatedAt: new Date(),
    };

    const result = await db.collection("cursos").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    result.matchedCount === 0
      ? res.status(404).json({ message: "Curso não encontrado" })
      : res.json({ ...updateData, _id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar curso", error });
  }
});

app.delete("/api/cursos/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection("cursos").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    
    result.deletedCount === 0
      ? res.status(404).json({ message: "Curso não encontrado" })
      : res.json({ message: "Curso excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir curso", error });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

export default app;