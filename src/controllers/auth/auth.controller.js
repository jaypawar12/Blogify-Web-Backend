const { StatusCodes } = require("http-status-codes");
const { successResponse, errorResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const UserService = require("../../services/auth/auth.service");

const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const sendMail = require("../../utils/email");

const userService = new UserService();

exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const exitsUser = await userService.fetchSingleUser({ user_email: req.body.user_email });

        if (exitsUser) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_EXIST));
        }

        req.body.password = await bcrypt.hash(req.body.password, 11);
        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss a');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss a');

        req.body.profile_image = req.file.path;

        const newUser = await userService.registerUser(req.body);


        return res.json(successResponse(StatusCodes.CREATED, false, MSG.USER_CREATED, newUser));
    } catch (error) {
        console.log(error);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);

        const user = await userService.fetchSingleUser({ user_email: req.body.user_email });
        console.log("User :", user);


        if (!user) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const matchPassword = await bcrypt.compare(req.body.password, user.password);

        if (!matchPassword) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.PASSWORD_NOT_MATCH));
        }

        const payload = {
            id: user.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json(successResponse(StatusCodes.OK, false, MSG.SUCCESS_LOGIN, { token }));


    } catch (error) {
        console.log(error);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body);

        const { user_email } = req.body;

        const user = await userService.fetchSingleUser({ user_email });
        console.log("User", user);

        if (!user) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.attempt_expire && user.attempt_expire < Date.now()) {
            user.attempt = 0;
        }

        if (user.attempt >= 3) {
            return res.json(errorResponse(StatusCodes.TOO_MANY_REQUESTS, true, MSG.MANY_TIME_OTP));
        }

        user.attempt++;

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const expireTime = new Date(Date.now() + 2 * 60 * 1000);
        sendMail(user_email, OTP);

        await userService.updateUser(user._id, { reset_otp: OTP, reset_otp_expire: expireTime, attempt: user.attempt, attempt_expire: new Date(Date.now() + 60 * 60 * 1000) });

        return res.json(successResponse(StatusCodes.OK, false, MSG.OTP_SEND));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        console.log(req.body);

        const { user_email, OTP } = req.body;

        const user = await userService.fetchSingleUser({ user_email });
        console.log("User", user);


        if (!user) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        if (user.verify_attempt_expire && user.verify_attempt_expire < Date.now()) {
            user.verify_attempt = 0;
        }

        if (user.verify_attempt >= 3) {
            return res.json(errorResponse(StatusCodes.TOO_MANY_REQUESTS, true, MSG.MANY_TIME_OTP));
        }

        if (user.reset_otp_expire < Date.now()) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.OTP_EXPIRED));
        }

        user.verify_attempt++;
        await userService.updateUser(user._id, { verify_attempt: user.verify_attempt, verify_attempt_expire: new Date(Date.now() + 60 * 60 * 1000) });

        if (OTP !== user.reset_otp) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.INVALID_OTP));
        }

        await userService.updateUser(user._id, { reset_otp: "", reset_otp_expire: null });

        return res.json(successResponse(StatusCodes.OK, false, MSG.VERIFY_OTP));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.changePassword = async (req, res) => {
    try {
        console.log(req.body);
        const { user_email, newPassword } = req.body;

        const user = await userService.fetchSingleUser({ user_email });

        if (!user) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        const hashed_password = await bcrypt.hash(newPassword, 11);

        await userService.updateUser(user._id, { password: hashed_password });

        return res.json(successResponse(StatusCodes.OK, false, MSG.PASSWORD_CHANGED));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}