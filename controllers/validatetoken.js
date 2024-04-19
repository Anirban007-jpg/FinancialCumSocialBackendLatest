const jwt = require("jsonwebtoken");
require('dotenv').config()


// berarer token is neccessary for admin functions

exports.validateTokenMiddleware = (req,res,next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if (err){
                res.status(401);
                throw new Error("User is not recognised")
            }
            req.user = decoded;
            next();
        })
    }
}

