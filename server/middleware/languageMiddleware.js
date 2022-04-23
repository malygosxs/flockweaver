module.exports = function (req, res, next){
    var match = req.url.match(/^\/([A-Z]{2})([\/\?].*)?$/i);
    if (match){
        req.lang = match[1];
        req.url = match[2] || '/';
    }
    next();
};