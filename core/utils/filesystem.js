const fs = require('fs');
const fse = require('fs-extra');

const filesystem = module.exports;

module.exports.createDirectory = (dir) => {
    fse.ensureDirSync(dir);
};

module.exports.removeFile = (file) => {
    fse.removeSync(file);
};

module.exports.getFileName = (filename) => {
    const lastIndexOfDot = filename.lastIndexOf('.');
    const name = filename.substring(0, lastIndexOfDot);

    return name;
};

module.exports.getFileExtension = (filename) => {
    const lastIndexOfDot = filename.lastIndexOf('.');
    const extension = filename.substring(lastIndexOfDot);

    return extension;
};

module.exports.isAcceptMimeType = (mimeType, mimeTypes) => {
    const index = mimeTypes.indexOf(mimeType);

    return index >= 0 ? true : false; 
};

module.exports.isAcceptFileSize = (size, limit, limitUnit) => {
    let fileSize = 0;

    switch(limitUnit) {
        case 'KB':
            fileSize = size / 1024;
            break;
        case 'MB':
            fileSize = size / (1024 * 1024);
            break;
        default:
            // Make fileSize more than fileSizeLimit
            fileSize = limit + 1;
            break;
    }

    return fileSize < limit ? true : false;
};