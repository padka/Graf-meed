require('dotenv').config();

// Экспортируем конфигурацию базы данных
module.exports = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Graf_meed',
  password: process.env.DB_PASSWORD || '0000',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
};