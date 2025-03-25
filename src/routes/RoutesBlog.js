const express = require('express');
const router = express.Router();
const blogController = require('../controllers/ControllerBlog');
const middlewareController = require('../middleware/jwt/ControllerJWT');
const upload = require('../middleware/upload');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/:id/views', blogController.incrementViews);

// Protected routes (require authentication)
router.post('/', middlewareController.verifyToken, upload.single('image'), blogController.createBlog);
router.put('/:id', middlewareController.verifyToken, upload.single('image'), blogController.updateBlog);
router.delete('/:id', middlewareController.verifyToken, blogController.deleteBlog);
router.post('/:id/comments', middlewareController.verifyToken, blogController.addComment);
router.post('/:id/like', middlewareController.verifyToken, blogController.likeBlog);

module.exports = router;
