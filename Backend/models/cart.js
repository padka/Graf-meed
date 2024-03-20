const { pool } = require('../conf/Database');

async function findOrCreateCart(userId) {
    try {
        // Проверяем, есть ли уже корзина для данного пользователя
        const res = await pool.query(`SELECT cart_id FROM carts WHERE user_id = $1;`, [userId]);
        if (res.rows.length > 0) {
            return res.rows[0].cart_id; // Возвращаем существующий cart_id
        } else {
            // Создаем новую корзину, если она не найдена
            const insertRes = await pool.query(`INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id;`, [userId]);
            return insertRes.rows[0].cart_id; // Возвращаем новый cart_id
        }
    } catch (error) {
        console.error(`Error in findOrCreateCart: ${error}`);
        throw error;
    }
}

async function addCartItem(userId, productId, quantity) {
    try {
        const cartId = await findOrCreateCart(userId);
        // Вставляем новый товар в корзину или обновляем его количество, если он уже там есть
        const res = await pool.query(`
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING *;
        `, [cartId, productId, quantity]);
        return res.rows[0];
    } catch (error) {
        console.error(`Error in addCartItem: ${error}`);
        throw error;
    }
}

async function getCartItems(userId) {
    try {
        const cartId = await findOrCreateCart(userId);
        // Получаем все товары из корзины пользователя
        const res = await pool.query(`
            SELECT ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, p.title, p.price, p.image
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1;
        `, [cartId]);
        return res.rows;
    } catch (error) {
        console.error(`Error in getCartItems: ${error}`);
        throw error;
    }
}

async function clearCart(userId) {
    try {
        const cartId = await findOrCreateCart(userId);
        // Удаляем все товары из корзины пользователя
        await pool.query(`DELETE FROM cart_items WHERE cart_id = $1;`, [cartId]);
    } catch (error) {
        console.error(`Error in clearCart: ${error}`);
        throw error;
    }
}

module.exports = {
    findOrCreateCart,
    addCartItem,
    getCartItems,
    clearCart
};
