require("dotenv").config();
const router = require("express").Router();
const UserModel = require("../models/user");
const authMiddlware = require("../middlewares/authMiddleWares");

router.get("/me", authMiddlware, async (req, res) => {
    console.log(req.cookies);
  try {
    //### Buscar al usuario en la base de datos
    const user = await UserModel.getUserById(req.user.id);
    const profile = await UserModel.getUserProfile(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //### devolver sin el password
    const { password, ...safeUser } = user;

    res.json({
      user: safeUser,
      profile: profile || {},
    });
  } catch (err) {
    console.error("Error en /me:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;
