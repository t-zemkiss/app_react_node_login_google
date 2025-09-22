const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.URL_GOOGLE_REDIRECTION || "",
});

router.get("/auth", async (req, res) => {
  const code = req.query.code || "";

  if (!code) {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });
    return res.redirect(authorizeUrl);
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const resUser = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const userInfo = await resUser.json();

    let users = await UserModel.getUserByEmail(userInfo.email);
    let userId;

    if (!users || users.length === 0) {
      //### Crear usuario y profile
      const newUser = await UserModel.createUser({
        name: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        googleId: userInfo.id,
      });
      userId = newUser.id;

      await UserModel.createUserProfile(userId, {
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        urlAvatar: userInfo.picture,
      });

      console.log("Usuario y profile creados:", userId);
    } else {
      userId = users[0].id;

      //### Actualizar google_id si no estaba guardado
      if (!users[0].google_id) {
        await pool.query("UPDATE users SET google_id=? WHERE id=?", [
          userInfo.id,
          userId,
        ]);
        console.log("google_id actualizado para usuario existente:", userId);
      }

      const profile = await UserModel.getUserProfile(userId);
      if (!profile || profile.length === 0) {
        await UserModel.createUserProfile(userId, {
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          urlAvatar: userInfo.picture,
        });
        console.log("Profile creado para usuario existente:", userId);
      } else {
        await UserModel.updateUserProfile(userId, {
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          urlAvatar: userInfo.picture,
        });
        console.log("Profile actualizado para usuario existente:", userId);
      }
    }

    const user = await UserModel.getUserByEmail(userInfo.email);
    const profile = await UserModel.getUserProfile(userId);

    //###Crear payload (sin password)
    const payload = {
      id: user[0].id,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      email: user[0].email,
      google_id: user[0].google_id,
      active: user[0].active,
      profile: profile || {},
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //### Guardar JWT en cookie segura
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "lax",
    });

    //### Redirigir al frontend (login)
    return res.redirect("http://localhost:5173/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error autenticando con Google");
  }
});

module.exports = router;
