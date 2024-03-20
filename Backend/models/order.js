const { pool } = require('../conf/Database');

// Функция создания нового заказа
async function createOrder(userId, cartItems) {
    const client = await pool.connect(); // Подключаемся к базе данных
    try {
        await client.query('BEGIN'); // Начинаем транзакцию

        // Вставляем новый заказ в таблицу orders и получаем его ID
        const orderRes = await client.query(`
            INSERT INTO orders (user_id, status, order_date)
            VALUES ($1, 'processing', NOW())
            RETURNING order_id;
        `, [userId]);
        const orderId = orderRes.rows[0].order_id;

        // Для каждого элемента в корзине вставляем запись в таблицу order_items
        for (const item of cartItems) {
            await client.query(`
                INSERT INTO order_items (order_id, product_id, quantity)
                VALUES ($1, $2, $3);
            `, [orderId, item.productId, item.quantity]);
        }

        await clearCart(userId); // Очищаем корзину пользователя после оформления заказа

        await client.query('COMMIT'); // Фиксируем транзакцию
        return { orderId, userId, cartItems }; // Возвращаем информацию о созданном заказе
    } catch (error) {
        await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
        throw error;
    } finally {
        client.release(); // Освобождаем подключение
    }
}

// Функция получения заказов пользователя по его ID
async function getOrdersByUserId(userId) {
    const ordersRes = await pool.query(`
        SELECT order_id, status, order_date
        FROM orders
        WHERE user_id = $1;
    `, [userId]);
    const orders = ordersRes.rows;

    // Для каждого заказа получаем детали заказанных товаров
    for (let order of orders) {
        const itemsRes = await pool.query(`
            SELECT oi.product_id, oi.quantity, p.title, p.price
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = $1;
        `, [order.order_id]);
        order.items = itemsRes.rows;
    }

    return orders; // Возвращаем список заказов с деталями
}

module.exports = {
    createOrder,
    getOrdersByUserId
};
