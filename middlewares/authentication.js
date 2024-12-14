const { verifyJWToken } = require("../services/jwt_auth");
const mongoose = require("mongoose");

function validateUserCookie(cookieName)  {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if(!token)
            return next();

        try {
            const user = verifyJWToken(token);           
            req.user = user;
        } catch (error) {
            console.log("error occured!");            
        }
        return next();
    }
}

function validateLoggedIn (cookieName) {
    return function (req, res, next) {
        const token = req.cookies[cookieName];

        const urlArr = req.originalUrl.split("/");        
        const lastpart = urlArr[urlArr.length-1];
        const suspect_id = lastpart.slice(0, -1);
        
        if(mongoose.Types.ObjectId.isValid(suspect_id) && req.method === "GET") 
            return next();
        
        const redirectURL = `/login?&redirect=${req.originalUrl}`;
        if(!token)
            return res.redirect(redirectURL);
        const user = verifyJWToken(token);
        if(!user)
            return res.redirect(redirectURL);
        next();
    }
}

module.exports = {
    validateUserCookie,
    validateLoggedIn,
};