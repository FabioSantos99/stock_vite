import jwt from "jsonwebtoken";

export const JWT_SECRET = "troque_por_uma_chave_secreta_forte";

// Verifica se o token JWT é válido
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

// Verifica se o usuário é admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas admins." });
  }
  next();
};