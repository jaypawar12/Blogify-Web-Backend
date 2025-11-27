const express = require('express');
const { getAllUsers, getUserProfile, deleteUser, updateUser, changePassword } = require('../../controllers/auth/user.controller');
const multer = require('multer');

const { storage } = require('../../config/cloudinary.config');

const route = express.Router();

const upload = multer({ storage });

route.get('/', getAllUsers);
route.get('/profile', getUserProfile);
route.delete('/', deleteUser);
route.put('/', upload.single('profile_image'), updateUser);
route.patch('/change_password', changePassword);


module.exports = route;