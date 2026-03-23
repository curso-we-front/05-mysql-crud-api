require("dotenv").config();
const express = require("express");
const articlesRouter = require("./routes/articles");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API de Artículos con MySQL" });
});

app.use("/articles", articlesRouter);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
