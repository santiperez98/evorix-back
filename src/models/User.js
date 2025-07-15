const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de que db.js tenga la conexión a Sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Será null si el usuario se registra con Google
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true // Solo se llenará si el usuario usa OAuth
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  timestamps: true
});

module.exports = User;
