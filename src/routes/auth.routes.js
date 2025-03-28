const express = require('express');
const { register, login, getUser } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', verifyToken, getUser);

module.exports = router;