// routes/comments.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');

router.get('/:videoId', commentController.getComments);

module.exports = router;
