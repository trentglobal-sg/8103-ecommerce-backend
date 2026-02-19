const pool = require('../database');

async function createUser(name, email, password, salutation, country, marketingPreferences) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. insert the user data into users table
        const bindings = [name, email, password, salutation, country];
        console.log(bindings);
        const [userResult] = await connection.execute(`INSERT INTO users
                (name, email, password, salutation, country) VALUES
                (?, ?, ?, ?, ?)
            `, bindings);

        // 2. take the ID of the new user, and associate the user with the selected marketing preferences
        const userId = userResult.insertId;
        for (let preference of marketingPreferences) {
            await connection.execute(`INSERT INTO user_marketing_preferences (user_id, preference_id)
                        VALUES (?, ?)
                `, [userId, preference])
        }
        await connection.commit();
    } catch (e) {
        await connection.rollback();
        console.error(e);
        throw (e);

    } finally {
        await connection.release();
    }

}

module.exports = {
    createUser
}