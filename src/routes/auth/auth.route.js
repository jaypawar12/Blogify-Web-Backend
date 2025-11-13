const express = require('express');
const { registerUser, loginUser, verifyOTP, forgotPassword, changePassword } = require('../../controllers/auth/auth.controller');

const multer = require('multer');
const { storage } = require("../../config/cloudinary.config");

const upload = multer({ storage });

const route = express.Router();

route.post('/register', upload.single('profile_image'), registerUser);
route.post('/login', loginUser);

route.post('/forgot_password', forgotPassword);
route.post('/verify_otp', verifyOTP);
route.post('/change_password', changePassword);

module.exports = route;