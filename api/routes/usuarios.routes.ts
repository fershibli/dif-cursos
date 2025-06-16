import express from "express";
import { efetuaLogin, insereUsuario } from "../controllers/usuarios.controller";
import { validateUsuario } from "../middlewares/validations.middleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *         ativo:
 *           type: boolean
 *           description: Status do usuário
 *         tipo:
 *           type: string
 *           enum: [Cliente, Admin]
 *           description: Tipo de usuário
 *         avatar:
 *           type: string
 *           format: uri
 *           description: URL do avatar do usuário
 */

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/register", validateUsuario, insereUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Efetua login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       403:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro ao efetuar login
 */
router.post("/login", efetuaLogin);

export default router;
