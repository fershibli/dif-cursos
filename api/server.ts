import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { body, param, query, validationResult } from "express-validator";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.resolve();


const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://dodowenzel:MBSKOnW8UipvlYYH@cursos-online.oz1cz2p.mongodb.net/cursosdb?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
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

app.get("/api/cursos/search", [
  query('search').optional().isString(),
  query('minPrice').optional().isFloat(),
  query('maxPrice').optional().isFloat(),
  query('minRating').optional().isFloat({min:0,max:5}),
  query('category').optional().isString(),
  query('page').isInt({min:1}),
  query('limit').isInt({min:1,max:100})
], async (req: Request, res: Response) => {
  try {
    // Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await connectToDatabase();
    let query: any = {};

    // Busca textual (title ou instructor)
    if (req.query.search) {
      query.$or = [
        { titulo: { $regex: req.query.search, $options: 'i' } },
        { instrutor: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filtros numéricos
    if (req.query.minPrice || req.query.maxPrice) {
      query.preco = {};
      if (req.query.minPrice) query.preco.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.preco.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minRating) {
      query.avaliacao = { $gte: Number(req.query.minRating) };
    }

    // Categoria
    if (req.query.category) {
      query.categoria = req.query.category;
    }

    // Paginação
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    const [cursos, total] = await Promise.all([
      db.collection("cursos").find(query).skip(skip).limit(limit).toArray(),
      db.collection("cursos").countDocuments(query)
    ]);

    res.json({
      data: cursos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ message: "Erro interno no servidor" });
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