const { StatusCodes } = require('http-status-codes');
const Blog = require('../../models/blog.model');
const { errorResponse } = require('../../utils/responseFormat');
const { MSG } = require('../../utils/message');

module.exports = class BlogService {
    async addBlog(body) {
        try {
            return await Blog.create(body);
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchAllBlogs() {
        try {
            return await Blog.find({}).populate('author', 'name gender profile_image').populate('comment.userId', 'name profile_image');
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async updateBlog(id, body) {
        try {
            return await Blog.findByIdAndUpdate(id, body, { new: true }).populate('author', 'name gender profile_image').populate('comment.userId', 'name profile_image');
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async deleteBlog(body) {
        try {
            return await Blog.findByIdAndDelete(body);
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchSingleBlog(body) {
        try {
            return await Blog.findOne(body).populate('author', 'name gender profile_image').populate('comment.userId', 'name profile_image');
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchCurrentUserBlogs(body) {
        try {
            return await Blog.find({ author: body }).populate('author', 'name gender profile_image');
        } catch (err) {
            console.log(err);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }
}