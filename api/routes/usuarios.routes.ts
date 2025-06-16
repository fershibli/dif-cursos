import express from "express";
import { efetuaLogin, insereUsuario } from "../controllers/usuarios.controller";
import { validateUsuario } from "../middlewares/validations.middleware";

const router = express.Router();

// Rota para inserir um novo usuário
router.post("/register", validateUsuario, insereUsuario);

// Rota para efetuar login
router.post("/login", efetuaLogin);

export default router;
