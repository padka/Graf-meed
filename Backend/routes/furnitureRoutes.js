const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ProductModel = require('../models/productModel');
const logger = require('../logger');

// Валидация и обработка запроса на добавление нового материала
router.post('/materials', [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description } = req.body;
        const newMaterial = await ProductModel.addMaterial(name, description);
        res.status(201).json(newMaterial);
    } catch (error) {
        logger.error(`Error in POST /materials: ${error.message}`, {
            route: '/materials',
            method: 'POST',
            body: req.body,
            errorStack: error.stack
        });
        res.status(500).send({ error: error.message });
    }
});

router.post('/dimensions', [
    body('width').isNumeric().withMessage('Width must be a numeric value'),
    body('height').isNumeric().withMessage('Height must be a numeric value'),
    body('depth').isNumeric().withMessage('Depth must be a numeric value'),
    body('productId').notEmpty().withMessage('Product ID is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { width, height, depth, productId } = req.body;
        const newDimension = await ProductModel.addDimension(width, height, depth, productId);
        res.status(201).json(newDimension);
    } catch (error) {
        logger.error(`Error in POST /dimensions: ${error.message}`, {
            route: '/dimensions',
            method: 'POST',
            body: req.body,
            errorStack: error.stack
        });
        res.status(500).send({ error: error.message });
    }
});

// Эндпоинт для добавления новых кастомизаций
router.post('/customizations', [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional() // description может быть необязательным
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description } = req.body;
        const newCustomization = await ProductModel.addCustomization(name, description);
        res.status(201).json(newCustomization);
    } catch (error) {
        logger.error(`Error in POST /customizations: ${error.message}`, {
            route: '/customizations',
            method: 'POST',
            body: req.body,
            errorStack: error.stack
        });
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;
