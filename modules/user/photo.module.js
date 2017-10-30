const filesystem = require('./../../core/utils/filesystem');
const text = require('./../../core/utils/text');
const multer = require('multer');
const env = require('./../../environment');

const USER_RESOURCES_DIR = env.application.modules.user.path;
const USER_PHOTO_PATH = env.application.modules.user.photo.path;
const FIELD_NAME = env.application.modules.user.photo.field_name;
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uid = req.user._id;
        const path = USER_RESOURCES_DIR + uid + USER_PHOTO_PATH;

        // Create folder
        filesystem.createDirectory(path);

        callback(null, path);
    },
    filename: (req, file, callback) => {
        const uid = req.user._id;
        const extension = filesystem.getFileExtension(file.originalname);
        const filename = uid + '_' + Date.now() + extension; 

        callback(null, filename);
    }
});

// Messages
module.exports.FILE_SIZE_LIMIT = FILE_SIZE_LIMIT = env.application.modules.user.photo.size_limit;
module.exports.FILE_SIZE_LIMIT_UNIT = FILE_SIZE_LIMIT_UNIT = env.application.modules.user.photo.size_limit_unit;
module.exports.FILE_SIZE_ERROR_MESSAGE =  FILE_SIZE_ERROR_MESSAGE = 'File size should be less than ' + FILE_SIZE_LIMIT + ' ' + FILE_SIZE_LIMIT_UNIT;

// Photo filter
module.exports.photoFilter = photoFilter = (req, file, callback) => {
    // Check mime type accept
    const mimeTypes = env.application.modules.user.photo.mime_type;
    const isValidMimeType = filesystem.isAcceptMimeType(file.mimetype, mimeTypes);
    if(!isValidMimeType){
        const mimeTypes = env.application.modules.user.photo.mime_type;
        const message = 'Support mime types: ' + mimeTypes.join(', ') + ' only';

        callback(message);
    }

    callback(null, true);
};

// Photo uploader
module.exports.uploader = uploader = multer({ 
    storage: storage,
    fileFilter: photoFilter 
}).single(FIELD_NAME);

// Upload
module.exports.upload = (req, res) => {
    const promise = new Promise((resolve, reject) => {
        uploader(req, res, (err) => {
            // Check error (included file extension accept)
            if (err) {
                reject(err);
                return;
            }
    
            // Check file size accept
            const isValidFileSize = filesystem.isAcceptFileSize(req.file.size, FILE_SIZE_LIMIT, FILE_SIZE_LIMIT_UNIT);
            if(!isValidFileSize){
                // Remove uploaded file
                filesystem.removeFile(req.file.path);
    
                reject(FILE_SIZE_ERROR_MESSAGE);
                return;
            }
    
            resolve();
        });
    });

    return promise;
};
