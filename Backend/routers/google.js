const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const UserModel = require("../models/user");

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

    res.json({ tokens, userInfo, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error autenticando con Google");
  }
});

module.exports = router;
