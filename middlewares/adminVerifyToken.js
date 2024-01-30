
const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {

    const token = req.headers.authorization;
    
    if (!token) {
        const error = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token,'jwt_9488');
        if (decoded) 
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = verifyToken;