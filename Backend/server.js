const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
require("dotenv").config();


const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, //### permitir envio de cookies
}));
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  return res.send({ Hello: "YES" });
});

const googleRouter = require("./routers/google.js");
const userRoutes = require("./routers/user.js")

app.use("/api/google", googleRouter);
app.use("/api/users", userRoutes);


app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
