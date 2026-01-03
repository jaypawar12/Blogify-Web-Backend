const { StatusCodes } = require("http-status-codes");
const { errorResponse, successResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const BlogService = require("../../services/blog/blog.service");

const blogService = new BlogService();

const moment = require('moment');

exports.addBlog = async (req, res) => {
    try {

        console.log(req.body);

        if (!req.body.title || !req.body.subtitle || !req.body.content) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_CREATION_FAILED));
        }

        if (!req.file) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_CREATION_FAILED));
        }

        if (req.body.tags) {
            try {
                // Try to parse as JSON first (from frontend)
                if (typeof req.body.tags === 'string' && req.body.tags.startsWith('[')) {
                    req.body.tags = JSON.parse(req.body.tags);
                } else {
                    // Otherwise split by comma
                    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(t => t);
                }
            } catch (err) {
                // If parsing fails, try splitting by comma
                req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }

        req.body.thumbnail = req.file.path;
        req.body.author = req.user._id;
        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss a');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss a');

        const newBlog = await blogService.addBlog(req.body);

        if (!newBlog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_CREATION_FAILED));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOG_CREATED));

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.getAllBlogs = async (req, res) => {
    try {

        const allBlogs = await blogService.fetchAllBlogs();

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOGS_FETCH_SUCCESS, allBlogs));

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.updateBlog = async (req, res) => {
    try {

        if (req.file) {
            req.body.thumbnail = req.file.path;
        }

        if (req.body.tags) {
            req.body.tags = req.body.tags.split(',').map(t => t.trim());
        }

        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss a');

        const updateBlog = await blogService.updateBlog(req.params.blogId, req.body);

        if (!updateBlog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_NOT_FOUND));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOG_UPDATED, updateBlog));

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.deleteBlog = async (req, res) => {
    try {

        console.log(req.params.blogId);

        const deletedBlog = await blogService.deleteBlog(req.params.blogId);

        console.log(deletedBlog);

        if (!deletedBlog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_NOT_FOUND));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOG_DELETED, deletedBlog));

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.getSingleBlog = async (req, res) => {
    try {

        console.log(req.params.blogId);

        const singleBlog = await blogService.fetchSingleBlog({ _id: req.params.blogId });

        if (!singleBlog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_NOT_FOUND));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOG_FETCH_SUCCESS, singleBlog));

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.getCurrentUserBlogs = async (req, res) => {
    try {
        console.log(req.user.id);

        const allUserBlogs = await blogService.fetchCurrentUserBlogs(req.user._id);

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.BLOGS_FETCH_SUCCESS, allUserBlogs));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.addBlogComment = async (req, res) => {
    try {

        console.log(req.params.blogId);
        console.log(req.body);

        const { msg } = req.body;

        if (!msg) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.MSG_REQUIRED));
        }

        const blog = await blogService.fetchSingleBlog({ _id: req.params.blogId });

        if (!blog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_NOT_FOUND));
        }

        const comment = {
            userId: req.user._id,
            msg,
            create_at: moment().format('DD/MM/YYYY, h:mm:ss a'),
        }

        blog.comment.push(comment);

        const addedComment = await blogService.updateBlog(req.params.blogId, { comment: blog.comment });

        if (!addedComment) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.COMMENT_FAILED));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.COMMENT_ADDED, addedComment));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.likeBlog = async (req, res) => {
    try {
        console.log(req.params.blogId);
        console.log(req.query);

        const blog = await blogService.fetchSingleBlog({ _id: req.params.blogId });

        if (!blog) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.BLOG_NOT_FOUND));
        }

        if (req.query.like == 'true') {
            blog.likes++;
        } else {
            blog.likes = Math.max(0, blog.likes - 1);
        }

        const addedLiked = await blogService.updateBlog(req.params.blogId, { likes: blog.likes });

        if (!addedLiked) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.LIKE_FAILED));
        }

        return res.json(successResponse(StatusCodes.CREATED, false, MSG.LIKE_ADDED, addedLiked));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}