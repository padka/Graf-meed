const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();
const logger = require('../logger');
const dbConfig = require('../conf/dbConfig');
const pool = new Pool(dbConfig);

// Валидация данных пользователя
const validateUserData = (username, password, email) => {
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isValidUsername = username.length > 4 && username.length < 21;
  const isValidPassword = password.length >= 8;
  return isValidEmail && isValidUsername && isValidPassword;
};


// Функция для выполнения SQL-запросов
async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, params);
    logger.info(`Query executed: ${query}`);
    return rows;
  } catch (error) {
    logger.error(`Error executing query: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}

// Функция для регистрации пользователя
async function registerUser(username, password, email) {
  if (!validateUserData(username, password, email)) {
    throw new Error('Invalid user data');
  }
  logger.info(`Registering user: ${username}`);
  const passwordHash = await bcrypt.hash(password, 10);
  const defaultRole = 'user';
  try {
    const newUser = await executeQuery(
      'INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, passwordHash, email, defaultRole]
    );
    logger.info(`User registered successfully: ${username}`);
    return newUser[0];
  } catch (error) {
    logger.error(`Error registering user ${username}: ${error.message}`);
    throw error;
  }
}

// Функция для аутентификации пользователя
async function authenticateUser(username, password) {
  logger.info(`Authenticating user: ${username}`);
  try {
    const users = await executeQuery('SELECT * FROM users WHERE username = $1', [username]);
    const user = users[0];
    if (!user) {
      logger.warn(`User not found: ${username}`);
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      logger.warn(`Invalid password for user: ${username}`);
      return null;
    }

    logger.info(`User authenticated successfully: ${username}`);
    const { password_hash, ...userInfo } = user; // Исключаем password_hash из возвращаемых данных
    return userInfo; // Возвращаем информацию о пользователе, включая его роль
  } catch (error) {
    logger.error(`Error authenticating user ${username}: ${error.message}`);
    throw error;
  }
}

// Функция для обновления пароля пользователя с использованием транзакции
async function updateUserPassword(username, newPassword) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2 RETURNING id, username',
      [passwordHash, username]
    );
    await client.query('COMMIT');

    if (result.rows.length === 0) {
      logger.warn(`User not found: ${username}`);
      return null;
    }
    logger.info(`Password updated successfully for user: ${username}`);
    return { message: "Password updated successfully.", userId: result.rows[0].id };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error updating password for user ${username}: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}
// Функция для удаления пользователя
async function deleteUser(username) {
  try {
    const deletedUser = await executeQuery(
      'DELETE FROM users WHERE username = $1 RETURNING id, username',
      [username]
    );
    if (deletedUser.length === 0) {
      throw new Error(`User not found: ${username}`);
    }
    logger.info(`User deleted successfully: ${username}`);
    return deletedUser[0];
  } catch (error) {
    logger.error(`Error deleting user ${username}: ${error.message}`);
    throw error;
  }
}
// Функция для обновления роли пользователя
async function updateUserRole(username, newRole) {
  try {
    const updatedUser = await executeQuery(
      'UPDATE users SET role = $1 WHERE username = $2 RETURNING id, username, role',
      [newRole, username]
    );
    if (updatedUser.length === 0) {
      throw new Error(`User not found: ${username}`);
    }
    logger.info(`User role updated successfully: ${username}`);
    return updatedUser[0];
  } catch (error) {
    logger.error(`Error updating user role ${username}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  updateUserPassword,
  updateUserRole,
  deleteUser,
};
