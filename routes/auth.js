const { Router } = require('express');
const express = require('express');
const { register, getUsers, login, verifyUser } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.get('/users', getUsers);
router.post('/login', login);
router.post('/verify', verifyUser)

module.exports = router;