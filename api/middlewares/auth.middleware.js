import jwt from "jsonwebtoken";

export default async function auth(req, res, next) {
  const token = req.header("access-token");
  if (!token)
    return res.status(401).json({
      msg: "Acesso negado. É obrgatório o envio de token JWT",
    });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "secret");
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    res.status(403).json({
      msg: "Token inválido",
    });
  }
}
