const path = require('path');

const auth = require('./../../middlewares/authenticate.middleware');
const text = require('./../../core/utils/text');
const User = require('./../../database/models/users.model');
const photo = require('./../../modules/user/photo.module');
const env = require('./../../environment');

function getUsers(req, res, next){
    User.getUsers()
        .then((users) => {
            return res.json(users);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function getUserById(req, res, next){
    const uid = req.params.uid;

    User.getUserById(uid)
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
            const uid = req.params.uid;
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
    const uid = req.params.uid;
    const update = req.body;

    User.updateUser(uid, update)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function deleteUser(req, res, next){
    const uid = req.params.uid;

    User.deleteUser(uid)
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            return res.json(err);
        });
}

module.exports = (app, router) => {
    // GET
    router.get('/users', auth.authen, getUsers);
    router.get('/users/:uid', auth.authen, getUserById);

    // POST
    router.post('/users/:uid/photo', auth.authen, uploadPhoto);

    // PUT
    router.put('/users/:uid', auth.authen, updateUser);
    
    // DELETE
    router.delete('/users/:uid', auth.authen, deleteUser);

    return router;
};
