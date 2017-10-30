const express = require('express');
const router = express.Router();

const env = require('./../environment');

module.exports = (app) => {
    // Authenticate
    require('./authenticate/authenticate.routes')(app, router);

    // Signup
    require('./signup/signup.routes')(app, router);

    // User
    require('./user/user.routes')(app, router);
    require('./user/user.admin.routes')(app, router);

    // Bookmark
    require('./bookmark/bookmark.routes')(app, router);

    // Route Prefix
    app.use(env.application.route.prefix, router);

    return router;
};
