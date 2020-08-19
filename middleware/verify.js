const jwt = require('jsonwebtoken');

let salt = 'mysalt';
const auth = (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(' ')[1];
    let data = verifyToken(token);
    if(data.email){
        next();
    }
    else{
        return res.json({
            data: null,
            error: 'invalid token'
        });
    }
};

const verifyToken = (token) => {
    let data = jwt.verify(token, salt);
    return data.email ? data: new Error('invalid token');
};
module.exports = auth;