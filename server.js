const express = require('express');
const app = express();
const path = require('path');

const env = require('./environment');

// Configuration
require('./config')(app);

// Extensions
require('./extensions')(app);

// Connect Database
require('./database/mongoose')();

// Routes
require('./routes')(app);

// Render index.html
app.get('*', (req, res) => {
    const filepath = path.join(__dirname, env.application.public_folder);
    res.sendFile(filepath + '/' + 'index.html');
});

// Server Listening
app.listen(env.application.PORT, () => {
    console.log('Server running at port ' + env.application.PORT + ' (' + env.application.MODE + ')');
});
