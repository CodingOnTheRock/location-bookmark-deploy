const jwt = require('jsonwebtoken');
const User = require('./../database/models/users.model');
const env = require('./../environment');

module.exports.authen = (req, res, next) => {
    const token = req.query.token || req.headers['authorization'];

    if(token){
        const secret = env.application.security.token.secret;
        const token_key = env.application.security.header.keys.token;

        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                return res.status(403).send({ 
                    success: false, 
                    message: 'Authentication failed.' 
                });
            }
            else{
                res.header(token_key, token);
                req.token = token;
                req.user = decoded._doc;

                next();
            }
        });
    }
    else{
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

module.exports.genToken = (req, res, next) => {
    let isNew = req.query.new || '';
    isNew = (isNew.toLowerCase() === 'true');
    if(!isNew){
        next();
        return;
    }

    // Generate new token
    const uid = req.user._id;
    User.getUserById(uid)
        .then((user) => {
            const secret = env.application.security.token.secret;
            const token_key = env.application.security.header.keys.token;
            const expire = env.application.security.token.expire;
            const token = jwt.sign(user, secret, {
                expiresIn: expire 
            });

            res.header(token_key, token);
            req.token = token;
            req.user = user;

            next();
        })
        .catch((err) => {
            return res.status(403).send({ 
                success: false, 
                message: 'Authentication failed.' 
            });
        });
}
