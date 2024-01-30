const jwt = require('jsonwebtoken');
const vendors = require('../models/vendorModel')

const verifyToken = async (req, res, next) => {
    
        const token = req.header('Authorization');
        if (!token) {
            const error = new Error('No token provided');
            error.statusCode = 401;
            return next(error);
        }
    
        try {
            const decoded = jwt.verify(token,'jwt_9488');
            if (decoded) {
                req._id=decoded.id
                next();
            }
            
        } catch (error) {
            next(error);
        }
}

module.exports = verifyToken;