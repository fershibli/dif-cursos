import express from "express";
import { efetuaLogin, insereUsuario } from "../controllers/usuarios.controller";

const router = express.Router();

// Rota para inserir um novo usuário
router.post("/", insereUsuario);

// Rota para efetuar login
router.post("/login", efetuaLogin);

export default router;
