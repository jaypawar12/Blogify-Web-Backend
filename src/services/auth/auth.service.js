const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const User = require('../../models/user.model');

module.exports = class UserService {
    // User Register
    async registerUser(body, res) {
        try {
            return await User.create(body);
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchSingleUserForOTP(body) {
        try {
            return await User.findOne(body);
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchSingleUser(body) {
        try {
            return await User.findOne(body).select('name email password gender about profile_image');
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async fetchAllUsers() {
        try {
            return await User.find({ isDelete: false }).select('name email gender about profile_image');
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    async updateUser(id, body) {
        try {
            return await User.findByIdAndUpdate(id, body, { new: true });
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    deleteUser() {
        try {

        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }


}