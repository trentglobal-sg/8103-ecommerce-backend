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

async function getUserByEmail(email) {
    const [rows] = await pool.execute(`select users.id, name, email, salutation, password, country, GROUP_CONCAT(preference_id) AS marketing_preference_ids from users join user_marketing_preferences
 ON users.id = user_marketing_preferences.user_id
where users.email = ?
GROUP BY users.id;`, [email]);
    return rows[0];
}

async function getUserById(id) {
    const [rows] = await pool.execute(`select users.id,
                                              name,
                                              email,
                                              salutation,
                                              password,
                                              country, 
                                              GROUP_CONCAT(preference_id) AS marketing_preference_ids 
                                       from users join user_marketing_preferences ON users.id = user_marketing_preferences.user_id
                                       where users.id = ?
                                       GROUP BY users.id;`, [id]);
    return rows[0];
}

async function updateUser(id, name, email, salutation, country, marketingPreferences) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const bindings = [name, email, salutation, country, id];
        console.log(bindings);
        await connection.execute(`UPDATE users
                                     SET name = ?,
                                     email = ?,
                                     salutation = ?,
                                     country = ?
                                  WHERE id = ? 
            `, bindings);

        // update the many to many relationships
        await connection.execute("DELETE FROM user_marketing_preferences WHERE user_id = ?", [id]);

        // add the many to many relationships according to marketingPreferences
        for (let preference of marketingPreferences) {
            await connection.execute(`INSERT INTO user_marketing_preferences (user_id, preference_id)
                        VALUES (?, ?)
                `, [id, preference])
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
    createUser,
    getUserByEmail,
    getUserById,
    updateUser
}