const pool = require('../database');

async function getOrdersByUserId(userId) {
    const query = `SELECT * FROM orders WHERE user_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
}

/**
 * 
 * @param {int} userId ID of the suer
 * @param {[{
 *   product_id: int,
 *   quantity: int
 * }]} orderItems  array of order items, with product_id and quantity
 */
async function createOrder(userId, orderItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log(orderItems);
        // calculate the total
        const total = orderItems.reduce(function (sum, item) {
            return sum + (item.price * item.quantity)
        }, 0);

        // create the row in the orders table
        const [orderResult] = await connection.execute(`
            INSERT INTO orders (user_id, total ) VALUES(?, ?)
        `, [userId, total]);

        console.log("order result =", orderResult);
        const newOrderId = orderResult.insertId;


        // for each item the user is buying, create one row in order items table
        for (let item of orderItems) {
            const sql = `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`;
            await connection.execute(sql, [newOrderId, item.product_id, item.quantity])
        }
        await connection.commit();
        return newOrderId;
    } catch (e) {
        await connection.rollback();
        console.error(e);
        throw (e);
    } finally {
        await connection.release();
    }

}

async function getOrderDetails(orderId) {
    const [rows] = await pool.query(`
        SELECT
            oi.product_id,
            p.name,
            p.price,
            oi.quantity,
            p.imageUrl
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);

    return rows;
}

async function updateOrderStatus(orderId, status) {
    // validate status before updatingOr
    if (!['created', 'processing', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}

async function updateOrderSessionId(orderId, sessionId) {
    await pool.query('UPDATE orders SET checkout_session_id = ? WHERE id = ?', [sessionId, orderId]);
}

module.exports = {
    getOrdersByUserId, createOrder, getOrderDetails, updateOrderStatus, updateOrderSessionId
}