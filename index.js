const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/db'); // Importa la conexión a la base de datos
const User = require('./src/models/User'); // Importa el modelo User
const authRoutes = require('./src/routes/auth.routes');
const morgan = require("morgan");
const userRoutes = require('./src/routes/user.routes');
const session = require('express-session');
const passport = require('./src/config/passport');


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Registra las solicitudes en la consola

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(session({ secret: 'secreto123', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// 🔄 Sincronizar la base de datos
sequelize.sync({ alter: true }) // Usa `force: true` solo si quieres borrar y recrear la tabla
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
