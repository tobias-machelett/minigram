require("dotenv").config();

const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

app.get("/test", (req, res) => {
  res.send("ok");
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo 🚀");
});
