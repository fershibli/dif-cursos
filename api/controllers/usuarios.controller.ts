import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../interfaces/tokenPayload.interface";
import { getDatabaseConnection } from "../db";

export const insereUsuario = async (req: Request, res: Response) => {
  req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.nome.replace(
    / /g,
    "+"
  )}&background=0D8ABC&color=fff`;
  const salt = await bcrypt.genSalt(10);
  req.body.senha = await bcrypt.hash(req.body.senha, salt);
  const db = await getDatabaseConnection();
  await db
    .collection("usuarios")
    .insertOne(req.body)
    .then((result: any) => res.status(201).send(result))
    .catch((err: any) => res.status(400).json(err));
};

export const efetuaLogin = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  try {
    const db = await getDatabaseConnection();
    let usuario = await db
      .collection("usuarios")
      .find({ email })
      .limit(1)
      .toArray();

    if (!usuario?.length || usuario?.[0]?.ativo === false) {
      return res.status(403).json({ message: "Dados de login inválidos" });
    }

    const isMatch = await bcrypt.compare(senha, usuario[0].senha);
    if (!isMatch) {
      return res.status(403).json({ message: "Dados de login inválidos" });
    }

    const secretKey = process.env.SECRET || "secret";
    const expiresIn = process.env.EXPIRES_IN || "1h"; // Default to 1 hour if not set
    const options: jwt.SignOptions = {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    };

    const tokenPayload: ITokenPayload = {
      usuario: {
        id: usuario[0]._id, // Convert ObjectId to string
      },
    };

    jwt.sign(tokenPayload, secretKey, options, (err, token) => {
      if (err) {
        console.error(err);
        throw err;
      }

      res.status(200).json({ message: "Login realizado com sucesso", token });
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao efetuar login", error });
  }
};
