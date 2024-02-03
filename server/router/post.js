const express = require('express');
const upload  = require('../middleware/post');

const router = express.Router()

const {
    
    getAllPosts,
    postByRange,
    postById,
    removeLike,
    addLike,
    addDislike,
    removeDislike,
    addView,
    addCommentLike,
    removeComemntLike,
    getCommentsByRange,
    searchPost,
    addComment,
    addPost

} = require('../controller/post');


router.put('/like/:id', addLike)

router.put('/dislike/:id', addDislike)

router.delete('/like/:id', removeLike)

router.delete('/dislike/:id', removeDislike)

router.put('/view/:id', addView)

router.put('/comment/like/:id', addCommentLike)

router.delete('/comment/like/:id', removeComemntLike)

router.get('/comment/:id/:from/:to', getCommentsByRange)

router.get('/search/:text', searchPost)

router.post('/comment/', addComment)

router.get('/', getAllPosts);

router.get('/:from/:to', postByRange)

router.get('/:id', postById)

router.post('/', upload.any(), addPost);


module.exports = router;