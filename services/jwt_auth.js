const jwt = require("jsonwebtoken");
const JWT_KEY = "My_Secret_key";

function createJWToken(user) {
    const { _id, pfpImage, name, email, password, salt } = user;
    const payload = {
        _id,
        pfpImage,
        name, 
        email, 
        password,
        salt,
    }
    const token = jwt.sign(payload, JWT_KEY);
    return token;
}

function verifyJWToken(token) {
    return jwt.verify(token, JWT_KEY);
}

module.exports = {
    createJWToken,
    verifyJWToken,
}