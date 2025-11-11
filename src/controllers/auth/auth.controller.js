const { StatusCodes } = require("http-status-codes");
const { successResponse, errorResponse } = require("../../utils/responseFormat");
const { MSG } = require("../../utils/message");
const UserService = require("../../services/auth/auth.service");

const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const userService = new UserService();

exports.registerUser = async (req, res) => {
    try {

        console.log(req.body);

        const exitsUser = await userService.fetchSingleUser({ email: req.body.email });

        if (exitsUser) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_EXIST));
        }

        req.body.password = await bcrypt.hash(req.body.password, 11);
        req.body.create_at = moment().format('DD/MM/YYYY, h:mm:ss a');
        req.body.update_at = moment().format('DD/MM/YYYY, h:mm:ss a');


        const newUser = await userService.registerUser(req.body);


        return res.json(successResponse(StatusCodes.CREATED, false, MSG.USER_CREATED, newUser));
    } catch (error) {
        console.log(error);
        return res.json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, true, MSG.SERVER_ERROR));
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await userService.fetchSingleUser({ email: req.body.email });

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