const router = require("express").Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const UserModel = require("../models/user");

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.URL_GOOGLE_REDIRECTION || "",
});

router.get("/auth", async (req, res) => {
  const code = req.query.code || "";
  if (code == "") {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });

    console.log("Redirigiendo a Google:", authorizeUrl);
    return res.redirect(authorizeUrl);
  } else {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      console.log("Tokens de Google:", tokens);

      const resUser = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );
      const userInfo = await resUser.json();

      console.log("Usuario Google:", userInfo);

      let infoDb = await UserModel.getUserByEmail(userInfo.email);
      console.log("infoDb", infoDb);

      res.json({ tokens, userInfo });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error autenticando con Google");
    }
  }
});

module.exports = router;
