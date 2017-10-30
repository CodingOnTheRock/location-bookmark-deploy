const morgan = require('morgan');
const env = require('./../environment');

module.exports = (app) => {
    if(env.application.MODE === 'development'){
        app.use(morgan('dev'));
    }
};