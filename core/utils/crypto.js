const bcrypt = require('bcrypt');

const crypto = module.exports;

module.exports.genHash = (value, round) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(round)
            .then((salt) => {
                bcrypt.hash(value, salt)
                    .then((hash) => {
                        resolve(hash);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.genHashSync = (value, round) => {
    const salt = bcrypt.genSaltSync(round);
    const hash = bcrypt.hashSync(value, salt);

    return hash;
}

module.exports.compareHash = (plainText, cipherText) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, cipherText)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.compareHashSync = (plainText, cipherText) => {
    return bcrypt.compareSync(plainText, cipherText);
}
