import { Router } from "express";
import {
  atualizar,
  buscarAvancada,
  buscarPorId,
  buscarRapida,
  criar,
  excluir,
  listarTodos,
} from "../controllers/cursos.controller";
import {
  validateAdvancedSearch,
  validateCourse,
} from "../middlewares/validations.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       500:
 *         description: Erro ao buscar cursos
 */
router.get("/", listarTodos);

/**
 * @swagger
 * /cursos/search:
 *   get:
 *     summary: Busca rápida de cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo de busca para título, instrutor ou categoria
 *     responses:
 *       200:
 *         description: Cursos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       500:
 *         description: Erro na busca
 */
router.get("/search", buscarRapida);

/**
 * @swagger
 * /cursos/search/advanced:
 *   get:
 *     summary: Busca avançada de cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPreco
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPreco
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categorias (separadas por vírgula)
 *       - in: query
 *         name: minDuracao
 *         schema:
 *           type: number
 *         description: Duração mínima em horas
 *       - in: query
 *         name: minAvaliacao
 *         schema:
 *           type: number
 *         description: Avaliação mínima (0-5)
 *     responses:
 *       200:
 *         description: Cursos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Erro de validação dos filtros
 *       500:
 *         description: Erro na busca
 */
router.get("/search/advanced", validateAdvancedSearch, buscarAvancada);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Busca um curso pelo ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao buscar curso
 */
router.get("/:id", buscarPorId);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao criar curso
 */
router.post("/", validateCourse, criar);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Atualiza um curso existente
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao atualizar curso
 */
router.put("/:id", validateCourse, atualizar);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso excluído com sucesso
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao excluir curso
 */
router.delete("/:id", excluir);

export default router;
