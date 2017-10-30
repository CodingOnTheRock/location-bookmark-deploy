module.exports = (() => {
    let env = 'development';
    if(process.env.NODE_ENV === 'production')
    {
        env = 'production';
    }

    return require('./environment.' + env);
})();