const express = require("express");
const { sequelize } = require("./db");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.route");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
// Rutas
app.get("/", (req, res) => res.send("API funcionando"));

// Sincronizar base de datos y arrancar servidor
sequelize.sync({ alter: true }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));
});
