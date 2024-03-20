const winston = require('winston');
const path = require('path');

// Создание и настройка логгера с использованием Winston
const logger = winston.createLogger({
    level: 'info', // Базовый уровень логирования
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }), // Для логирования стека ошибок
        winston.format.json()
    ),
    transports: [
        // Логирование ошибок в файл
        new winston.transports.File({ 
            filename: path.join(__dirname, 'logs/error.log'), 
            level: 'error' 
        }),
        // Логирование всех сообщений в файл
        new winston.transports.File({ 
            filename: path.join(__dirname, 'logs/combined.log') 
        }),
    ],
});

// Добавление транспорта для вывода логов в консоль в не-продакшн режимах
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(), // Добавление цветов к уровням логирования
            winston.format.simple() // Простой формат вывода
        ),
    }));
}

module.exports = logger;
