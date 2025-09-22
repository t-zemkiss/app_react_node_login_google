const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();

const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  return res.send({ Hello: "YES" });
});

const googleRouter = require("./routers/google.js");

app.use("/google", googleRouter);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
