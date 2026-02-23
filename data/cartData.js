const pool = require('../database');

async function getCartContents(userId) {
   const sql = `SELECT c.id, c.product_id, p.imageUrl, 
                       p.name, c.quantity, CAST(price AS DOUBLE) AS price 
                FROM cart_items c JOIN products p
                    ON c.product_id = p.id
                WHERE c.user_id = ?`

    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}

// cartItems will be an array of object
// each object has two keys:
// {
//   product_id: <id of the product>
//   quantity: <number of quantity >
//}
async function updateCart(userId, cartItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // empty all items from the shopping cart
        await connection.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);

        // add all products and quantity from cartItems
        for (let item of cartItems) {
            const sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?,?,?)";
            const bindings = [userId, item.product_id, item.quantity];
            await connection.execute(sql, bindings);
        }


        await connection.commit();
    } catch (e) {   
        await connection.rollback();
        console.error(e);
        throw(e);
    } finally {
        await connection.release();
    }
 }

 module.exports = {
    getCartContents,
    updateCart
 }