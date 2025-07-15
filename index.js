const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/db');
const User = require('./src/models/User');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const morgan = require("morgan");
const session = require('express-session');
const passport = require('./src/config/passport');
const cookieParser = require('cookie-parser');
const dashboardRoutes = require('./src/routes/dashboard.route');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // 🥠 ANTES que session
app.use(
  session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'Lax',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://evorix.vercel.app/",
    credentials: true,
  })
);

app.use(morgan("dev"));

// Rutas
app.use('/api/auth', authRoutes);


app.use('/api/users', userRoutes);
app.use('/api', dashboardRoutes); 
// Sincronizar DB
sequelize.sync({ alter: true })
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
