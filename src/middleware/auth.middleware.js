const { StatusCodes } = require("http-status-codes");
const { errorResponse } = require("../utils/responseFormat");
const { MSG } = require("../utils/message");
const jwt = require('jsonwebtoken');
const UserService = require("../services/auth/auth.service");

const userService = new UserService();

const authMiddleware = async (req, res, next) => {

    let token = req.headers['authorization'];

    if (!token) {
        return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.TOKEN_MISSING));
    }
    try {
        token = token.slice(7, token.length);

        const decodeData = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userService.fetchSingleUser({ _id: decodeData.id }, 'user_name user_email password gender about profile_image create_at update_at');

        if (!user) {
            return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.USER_NOT_FOUND));
        }

        req.user = user;

        next();

    } catch (err) {
        console.log(err);
        return res.json(errorResponse(StatusCodes.BAD_REQUEST, true, MSG.TOKEN_INVALID));
    }

}

module.exports = authMiddleware;