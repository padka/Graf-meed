const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerUser, authenticateUser, updateUserPassword } = require('../models/UserModel'); 
const router = express.Router();

// Секретный ключ для JWT, лучше хранить в переменных окружения
const JWT_SECRET = process.env.JWT_SECRET || 'ppjasd5ng397OcO7rvuF+v/9yfglASV3lX7tCg2lzdY=';

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await registerUser(username, password, email);
    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Unable to register user due to server error." });
  }
});

// Аутентификация пользователя и возврат JWT токена
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials provided." });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "User authenticated successfully.", token, user });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed due to server error." });
  }
});

// Проверка токена
router.post('/validateToken', authenticateToken, (req, res) => {
  res.json({ user: req.user }); // Возвращаем декодированные данные пользователя
});

// Обновление пароля пользователя
router.put('/updatePassword', authenticateToken, async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const result = await updateUserPassword(username, newPassword);
    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Password successfully updated.", userId: result.userId });
  } catch (error) {
    res.status(500).json({ message: "Unable to update password due to server error." });
  }
});

// Обновление роли пользователя
router.put('/updateUserRole', authenticateToken, async (req, res) => {
  try {
    const { username, newRole } = req.body;
    const updatedUser = await updateUserRole(username, newRole);
    res.status(200).json({ message: "User role updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Unable to update user role due to server error." });
  }
});

// Удаление пользователя
router.delete('/deleteUser', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    const deletedUser = await deleteUser(username);
    res.status(200).json({ message: "User deleted successfully.", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete user due to server error." });
  }
});

module.exports = router;