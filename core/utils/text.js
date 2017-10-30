const text = module.exports;

module.exports.replaceAll = (source, search, replacement) => {
    return source.split(search).join(replacement);
};