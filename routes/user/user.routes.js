const path = require('path');

const auth = require('./../../middlewares/authenticate.middleware');
const crypto = require('./../../core/utils/crypto');
const text = require('./../../core/utils/text');
const User = require('./../../database/models/users.model');
const photo = require('./../../modules/user/photo.module');
const env = require('./../../environment');

function getUserPhoto(req, res, next){
    const uid = req.params.uid;
    const photo = req.params.photo;

    const basePath = process.cwd();
    const usersPath = env.application.modules.user.path;
    const photoPath = env.application.modules.user.photo.path;
    const filePath = path.join(basePath, usersPath, uid, photoPath, photo);

    res.sendFile(filePath);
}

function createUser(req, res, next){
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        created: new Date()
    });

    User.createUser(user)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function uploadPhoto(req, res, next){
    const message = { success: false, message: '' };

    photo.upload(req, res)
        .then(() => {
            // Update user's photo
            const uid = req.user._id;
            const filePath = req.file.path;
            const newFilePath = text.replaceAll(filePath, '\\', '/');
            User.updateUserPhoto(uid, newFilePath)
                .then((user) => {
                    message.success = true;
                    return res.json(message);
                })
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            message.message = err;
            return res.status(400).json(message);
        });
}

function updateUser(req, res, next){
    const uid = req.user._id;
    const update = req.body;

    User.updateUser(uid, update)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function updateUserPassword(req, res, next){
    const uid = req.user._id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const salt_factor = env.application.security.encryption.salt_factor;
    const message = { success: false, message: '' };

    User.getUserById(uid)
        .then((user) => {
            // Check user
            if(!user){
                throw 'Not found user';
            }

            // Compare current password
            const isCurrentPasswordCorrect = crypto.compareHashSync(currentPassword, user.password);
            if(!isCurrentPasswordCorrect){
                throw 'Current password is incorrect';
            }

            // Update password
            user.password = crypto.genHashSync(newPassword, salt_factor);
            User.updateUser(uid, user)
                .then((user) => {
                    message.success = true;
                    return res.json(message);
                })
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            message.message = err;
            return res.json(message);
        });
}

module.exports = (app, router) => {
    // GET
    app.get('/resources/users/:uid/photo/:photo', getUserPhoto);

    // POST
    router.post('/user', auth.authen, createUser);
    router.post('/user/photo', auth.authen, uploadPhoto);

    // PUT
    router.put('/user', auth.authen, updateUser);
    router.put('/user/update/password', auth.authen, updateUserPassword);

    return router;
};
