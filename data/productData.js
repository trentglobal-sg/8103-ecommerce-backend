const pool = require('../database');

async function getAllProducts() {
    const [rows] = await pool.execute("SELECT * FROM products");
    return rows;
}

async function getProductById(id) {
    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
}

module.exports = {
    getAllProducts, getProductById
}