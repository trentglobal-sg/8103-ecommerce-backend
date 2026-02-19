const bcrypt = require('bcrypt')

const userData = require("../data/userData");


async function createUser(name, email, password, salutation, country, marketingPreferences) {
    // do validation
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    return await userData.createUser(name, email, hashedPassword, salutation, country, marketingPreferences);
}

module.exports = {
    createUser
}