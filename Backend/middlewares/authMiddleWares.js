const jwt = require("jsonwebtoken");

const authMiddlware = async (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddlware;
