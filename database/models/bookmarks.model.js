const mongoose = require('mongoose');
const crypto = require('./../../core/utils/crypto');
const env = require('./../../environment');

const User = require('./users.model');
const Schema = mongoose.Schema;
const bookmarksSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'name must not exceed 50 characters']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [255, 'description must not exceed 255 characters']
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
    created: {
        type: Date
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'Users'
    }
});

// Before findOneAndUpdate command execute. it will be trigger this callback
bookmarksSchema.pre('findOneAndUpdate', function(next){
    const updateBookmark = this._update;

    // updated property
    updateBookmark.updated = new Date();
    
    next();
});

const Bookmark = module.exports = mongoose.model('Bookmarks', bookmarksSchema);

// Get Bookmarks
module.exports.getBookmarks = (uid) => {
    return new Promise((resolve, reject) => {
        // Get user by ID
        User.getUserById(uid)
            .then((user) => {
                // Find bookmarks
                Bookmark.find({ "user": user._id }, (err, res) => {
                    if(err) {
                        reject(err);
                    }

                    resolve(res);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// Get Bookmark
module.exports.getBookmark = (uid, bid) => {
    return new Promise((resolve, reject) => {
        // Get user by ID
        User.getUserById(uid)
            .then((user) => {
                // Find bookmark
                Bookmark.find({ user: user._id, _id: bid }, (err, res) => {
                    if(err) {
                        reject(err);
                    }

                    resolve(res);
                })
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// Create Bookmark
module.exports.createBookmark = (uid, bookmark) => {
    return new Promise((resolve, reject) => {
        // Get user by ID
        User.getUserById(uid)
            .then((user) => {
                // Create bookmark
                bookmark.user = user;
                Bookmark.create(bookmark)
                    .then((bookmark) => {
                        // Remove reference
                        let modifiedBookmark = Object.assign({}, bookmark._doc);
                        delete modifiedBookmark.user;

                        resolve(modifiedBookmark);
                    })
                    .catch((err) => {
                        throw err;
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// Update Bookmark
module.exports.updateBookmark = (bid, bookmark) => {
    return new Promise((resolve, reject) => {
        Bookmark.findOneAndUpdate({ _id: bid }, bookmark, { new: true, runValidators: true }, (err, doc, res) => {
            if(err){
                reject(err);
                return;
            }
            
            resolve(doc);
        })
    });
}

// Delete Bookmark
module.exports.deleteBookmark = (bid) => {
    return new Promise((resolve, reject) => {
        Bookmark.findOneAndRemove({ _id: bid }, (err, res) => {
            if(err){
                reject(err);
                return;
            }

            resolve(res);
        });
    });   
}
