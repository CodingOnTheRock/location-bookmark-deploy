module.exports = (app) => {
    // CORS
    require('./cors')(app);

    // Body Parser
    require('./body-parser')(app);

    // Morgan
    require('./morgan')(app);

    // Compression
    require('./compression')(app);
}