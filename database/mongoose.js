const mongoose = require('mongoose');
const env = require('./../environment');

module.exports = () => {
    mongoose.connect(env.database.uri, (err) => {
        if(err){
            throw err;
        }

        console.log('Connected to database...');
    });
}