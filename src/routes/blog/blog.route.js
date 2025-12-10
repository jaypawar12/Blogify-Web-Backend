const express = require('express');
const { addBlog, getAllBlogs, deleteBlog, updateBlog, getSingleBlog, getCurrentUserBlogs, addBlogComment, likeBlog } = require('../../controllers/blog/blog.controller');
const multer = require('multer');
const { storage } = require('../../config/cloudinary.config');

const route = express.Router();

const upload = multer({ storage });

route.post('/', upload.single('thumbnail'), addBlog);
route.get('/', getAllBlogs);
route.put('/:blogId', upload.single('thumbnail'), updateBlog);
route.delete('/:blogId', deleteBlog);

route.get('/:blogId', getSingleBlog);
route.get('/current/user/blogs', getCurrentUserBlogs);

route.post('/:blogId/comment', addBlogComment);
route.get('/:blogId/likes', likeBlog);


module.exports = route;