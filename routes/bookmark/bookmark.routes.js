const auth = require('./../../middlewares/authenticate.middleware');
const Bookmark = require('./../../database/models/bookmarks.model');

function getBookmarks(req, res, next){
    const uid = req.user._id;

    Bookmark.getBookmarks(uid)
        .then((bookmarks) => {
            return res.json(bookmarks);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function getBookmark(req, res, next){
    const uid = req.user._id;
    const bid = req.params.bid;

    Bookmark.getBookmark(uid, bid)
        .then((bookmark) => {
            return res.json(bookmark);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function createBookmark(req, res, next){
    const uid = req.user._id;
    const bookmark = new Bookmark({
        name: req.body.name,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        created: new Date()
    });

    Bookmark.createBookmark(uid, bookmark)
        .then((bookmark) => {
            return res.json(bookmark);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function updateBookmark(req, res, next){
    const uid = req.user._id;
    const bid = req.params.bid;
    const updateBookmark = req.body;

    Bookmark.getBookmark(uid, bid)
        .then((user) => {
            return Bookmark.updateBookmark(bid, updateBookmark);
        })
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            return res.json(err);
        });
}

function deleteBookmark(req, res, next){
    const bid = req.params.bid;
    
    Bookmark.deleteBookmark(bid)
        .then((data) => {
            return res.json(data);
        })
        .catch((err) => {
            return res.json(err);
        });
}

module.exports = (app, router) => {
    // GET
    router.get('/bookmarks', auth.authen, getBookmarks);
    router.get('/bookmarks/:bid', auth.authen, getBookmark);

    // POST
    router.post('/bookmark', auth.authen, createBookmark)

    // PUT
    router.put('/bookmarks/:bid', auth.authen, updateBookmark);
    
    // DELETE
    router.delete('/bookmarks/:bid', auth.authen, deleteBookmark);

    return router;
};
