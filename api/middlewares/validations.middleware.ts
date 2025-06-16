import { NextFunction, Request, Response } from "express";
import { body, check, query, validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

export const validateUsuario = [
  check("nome")
    .not()
    .isEmpty()
    .trim()
    .withMessage("É obrigatório informar o nome")
    .isAlpha("pt-BR", { ignore: " " })
    .withMessage("Informe apenas texto")
    .isLength({ min: 3 })
    .withMessage("Informe no mínimo 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("Informe no máximo 100 caracteres"),
  check("email")
    .not()
    .isEmpty()
    .trim()
    .withMessage("É obrigatório informar o e-mail")
    .isEmail()
    .withMessage("Informe um e-mail válido")
    .isLowercase()
    .withMessage("Não são permitidas letras maiúsculas"),
  check("senha")
    .not()
    .isEmpty()
    .trim()
    .withMessage("A senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter no mínimo 6 caracteres")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "A senha não é segura. Informe no mínimo 1 caractere maiúsculo, 1 minúsculo, 1 número e 1 caractere especial"
    ),
  check("ativo")
    .default(true)
    .isBoolean()
    .withMessage("O valor deve ser um booleano"),
  check("tipo")
    .default("Cliente")
    .isIn(["Cliente", "Admin"])
    .withMessage("O tipo deve ser Admin ou Cliente"),
  check("avatar")
    .optional({ nullable: true })
    .isURL()
    .withMessage("A URL do avatar é inválida"),
  validateRequest,
];

export const validateCourse = [
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
  validateRequest,
];

export const validateAdvancedSearch = [
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
  validateRequest,
];
