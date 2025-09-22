const express = require("express");
const body_parser = require("body-parser");
const port = process.env.PORT || 3000;

app = express();
app.use("body_parser", body_parser);

app.get("/", (req, res) => {
  return res.send({ Hello: "YES" });
});
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
