const mongoose = require('mongoose');
const crypto = require('./../../core/utils/crypto');
const filesystem = require('./../../core/utils/filesystem');
const env = require('./../../environment');

const Schema = mongoose.Schema;
const usersSchema = Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'firstname must not exceed 50 characters']
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'lastname must not exceed 50 characters']
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'name must not exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        maxlength: [100, 'email must not exceed 100 characters']
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        trim: true,
    },
    created: {
        type: Date
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

// Before create command execute. it will be trigger this callback 
// *** create command will be trigger save command [ save() ]  ***
usersSchema.pre('save', function(next){
    const salt_factor = env.application.security.encryption.salt_factor;
    const user = this;

    // password property
    crypto.genHash(user.password, salt_factor)
        .then((hash) => {
            user.password = hash;
            next();
        })
        .catch((err) => {
            next(err);
        });
});

// Before findOneAndUpdate command execute. it will be trigger this callback
usersSchema.pre('findOneAndUpdate', function(next){
    const salt_factor = env.application.security.encryption.salt_factor;
    const update = this._update;

    // updated property
    update.updated = new Date();

    next()
});

const User = module.exports = mongoose.model('Users', usersSchema);

// Get Users
module.exports.getUsers = (limit) => {
    return new Promise((resolve, reject) => {
        User.find((err, data) => {
            if(err){
                reject(err);
                return;
            }

            resolve(data);
        }).limit(limit);
    });
}

// Get User By ID
module.exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, data) => {
            if(err){
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

// Get User By E-Mail
module.exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, (err, res) => {
            if(err){
                reject(err);
                return;
            }

            resolve(res);
        });
    });
}

// Create User
module.exports.createUser = (user) => {
    return User.create(user);
}

// Update User
module.exports.updateUser = (id, user) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ _id: id }, user, { new: true, runValidators: true }, (err, doc, res) => {
            if(err){
                reject(err);
                return;
            }
            
            resolve(doc);
        })
    });
}

// Update User Photo
module.exports.updateUserPhoto = (id, photo) => {
    return new Promise((resolve, reject) => {
        User.getUserById(id)
            .then((user) => {
                // Remove previous photo
                filesystem.removeFile(user.photo);

                // Update new photo
                user.photo = photo;

                return User.updateUser(id, user);
            })
            .then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            });
    });
    
    return promise;
}

// Delete User
module.exports.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        User.findOneAndRemove({ _id: id }, (err, res) => {
            if(err){
                reject(err);
                return;
            }

            resolve(res);
        });
    });   
}
