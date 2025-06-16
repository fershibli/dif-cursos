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

const router = Router();

router.get("/", listarTodos);
router.get("/search", buscarRapida);
router.get("/search/advanced", validateAdvancedSearch, buscarAvancada);
router.get("/:id", buscarPorId);
router.post("/", validateCourse, criar);
router.put("/:id", validateCourse, atualizar);
router.delete("/:id", excluir);

export default router;
