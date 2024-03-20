const express = require('express');
const jwt = require('jsonwebtoken');
const cartModel = require('../models/cart');
const orderModel = require('../models/order');
const router = express.Router();
require('dotenv').config();

// Middleware для аутентификации токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.userId = decoded.id; // Добавляем id пользователя в объект запроса
            next();
        });
    } else {
        res.status(401).json({ message: 'Token not provided' });
    }
};

// Добавление товара в корзину
router.post('/addToCart', authenticateToken, async (req, res) => {
    const { userId } = req;
    const { productId, quantity } = req.body;

    try {
        const addedItem = await cartModel.addCartItem(userId, productId, quantity);
        res.status(201).json({ message: 'Item added to cart successfully', item: addedItem });
    } catch (error) {
        console.error(`Error adding item to cart: ${error}`);
        res.status(500).json({ message: 'Error adding item to cart', error: error.toString() });
    }
});

// Оформление заказа
router.post('/placeOrder', authenticateToken, async (req, res) => {
    const { userId } = req;

    try {
        const cartItems = await cartModel.getCartItems(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = await orderModel.createOrder(userId, cartItems);
        await cartModel.clearCart(userId); // Очищаем корзину после оформления заказа
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error(`Error placing order: ${error}`);
        res.status(500).json({ message: 'Error placing order', error: error.toString() });
    }
});

// Получение списка заказов пользователя
router.get('/myOrders', authenticateToken, async (req, res) => {
    const { userId } = req;

    try {
        const orders = await orderModel.getOrdersByUserId(userId);
        res.json({ orders }); // Возвращаем список заказов текущего пользователя
    } catch (error) {
        console.error(`Error retrieving orders: ${error}`);
        res.status(500).json({ message: 'Error retrieving orders', error: error.toString() });
    }
});

module.exports = router;
