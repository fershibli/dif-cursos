import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../interfaces/tokenPayload.interface";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequest.interface";

export default async function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({
      msg: "Acesso negado. É obrgatório o envio de token JWT",
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "secret"
    ) as ITokenPayload;
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    res.status(403).json({
      msg: "Token inválido",
    });
  }
}
