const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const User = require('../../models/user.model');

module.exports = class UserService {
    // User Register
    async registerUser(body) {
        try {
            return await User.create(body);
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    // Fetch Single User body = {email : gautam@gmail.cp,}
    async fetchSingleUser(body) {
        try {
            return await User.findOne(body);
        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    // Fetch All Users
    fetchAllUsers() {
        try {

        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    // Update User
    updateUser() {
        try {

        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }

    // Delete User
    deleteUser() {
        try {

        } catch (error) {
            console.log(error);
            return errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR);
        }
    }


}