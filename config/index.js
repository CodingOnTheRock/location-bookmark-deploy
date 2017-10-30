const express = require('express');
const path = require('path');

const env = require('./../environment');

module.exports = (app) => {
    // Set Static Folder
    const filepath = path.join(__dirname, '..', env.application.public_folder);
    app.use(express.static(filepath));
}