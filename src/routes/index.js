const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const route = express.Router();

route.use('/auth', require('./auth/auth.route'));

route.use(authMiddleware);
route.use('/user', require('./auth/user.route'));
route.use('/blog', require('./blog/blog.route'));

module.exports = route;