const express = require('express');
const router = express.Router();
const introSectionModel = require('../models/introSection'); // Проверьте, что путь к модели верный
require('dotenv').config();

// HTTP статус-коды для улучшения читаемости
const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

// Добавим простое логирование для отслеживания запросов
router.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Роут для получения данных раздела введения
router.get('/', async (req, res) => {
    try {
        console.log('Fetching intro section...');
        const introSection = await introSectionModel.getIntroSection();
        if (!introSection) {
            console.log('Intro section not found');
            // Отправляем статус 404 Not Found, если данные не найдены
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Intro section not found' });
        }
        console.log('Intro section fetched successfully');
        // Отправляем полученные данные с статусом 200 OK
        res.status(HTTP_STATUS.OK).json(introSection);
    } catch (error) {
        console.error('Error fetching intro section:', error.message);
        // Логируем ошибку и отправляем статус 500 Internal Server Error с описанием ошибки
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;
