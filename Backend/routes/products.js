const express = require('express');
const router = express.Router();
const logger = require('../logger'); // Убедитесь, что путь к логгеру корректный
const productsModel = require('../models/products'); // Подключаем модель продуктов

// Маршрут для получения всех продуктов
router.get('/', async (req, res, next) => {
    try {
        const products = await productsModel.getProducts();
        res.json({ success: true, data: products });
    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
    }
});

module.exports = router;
