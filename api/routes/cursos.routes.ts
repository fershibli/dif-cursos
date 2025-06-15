import { Router } from "express"
import { body, query } from "express-validator"
import {
    atualizar,
    buscarAvancada,
    buscarPorId,
    buscarRapida,
    criar,
    excluir,
    listarTodos,
} from "../controllers/cursos.controller"

const router = Router()

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
]

const validateAdvancedSearch = [
    query("minPreco")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Preço mínimo não pode ser negativo"),
    query("maxPreco")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Preço máximo não pode ser negativo"),
    query("minDuracao")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Duração mínima não pode ser negativa"),
    query("minAvaliacao")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Avaliação deve ser entre 0 e 5"),
]

router.get("/", listarTodos)
router.get("/search", buscarRapida)
router.get("/search/advanced", validateAdvancedSearch, buscarAvancada)
router.get("/:id", buscarPorId)
router.post("/", validateCourse, criar)
router.put("/:id", validateCourse, atualizar)
router.delete("/:id", excluir)

export default router
