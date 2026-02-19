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

async function login(email, password) {
    // get the user by email
    const user = await userData.getUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
         // todo: generate a JWT and send back the JWTs
        return user;
    } else {
        throw new Error("Invalid email or pasword")
    }

   
}

async function updateUser(id, name, email, salutation, country, marketingPreferences) {
    return await userData.updateUser(id, name, email, salutation, country, marketingPreferences);
}

async function getUserProfile(id) {
    const user = await userData.getUserById(id);
    user.marketingPreferences = user.marketing_preference_ids.split(',');
    delete user.marketing_preference_ids;
    delete user.password;
    return user;
}

module.exports = {
    createUser,
    login,
    updateUser,
    getUserProfile
}