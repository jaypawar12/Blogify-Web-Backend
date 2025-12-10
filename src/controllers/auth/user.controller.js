const { StatusCodes } = require("http-status-codes");
const { errorResponse, successResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const UserService = require("../../services/auth/auth.service");

const moment = require('moment');
const bcrypt = require('bcrypt')

const userService = new UserService();


exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.fetchAllUsers();
        return res.json(successResponse(StatusCodes.OK, false, MSG.USERS_SUCCESS, allUsers));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.getUserProfile = (req, res) => {
    try {
        return res.json(successResponse(StatusCodes.OK, false, MSG.USER_SUCCESS, req.user));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.updateUser(req.user._id, { isDelete: true });

        if (!deletedUser) {
            return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
        }
        return res.json(successResponse(StatusCodes.OK, false, MSG.USER_DELETED, deletedUser));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.updateUser = async (req, res) => {
    try {
        console.log(req.body);

        if (req.file) {
            console.log(req.file);

            req.body.profile_image = req.file.path;
        }

        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss a');

        const updatedUser = await userService.updateUser(req.user._id, req.body);

        if (!updatedUser) {
            return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
        }
        return res.json(successResponse(StatusCodes.OK, false, MSG.USER_UPDATED, updatedUser));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.changePassword = async (req, res) => {
    try {
        console.log(req.body);

        const pswMatch = await bcrypt.compare(req.body.current_password, req.user.password);


        if (!pswMatch) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.PASSWORD_NOT_MATCH));
        }

        const hashPassword = await bcrypt.hash(req.body.new_password, 11);

        const update_at = moment().format('DD/MM/YYYY, h:mm:ss a');

        const updatedUser = await userService.updateUser(req.user._id, { password: hashPassword, update_at });

        if (!updatedUser) {
            return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
        }
        return res.json(successResponse(StatusCodes.OK, false, MSG.PASSWORD_CHANGED, updatedUser));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}