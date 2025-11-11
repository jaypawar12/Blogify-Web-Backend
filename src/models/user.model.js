const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: String,
    user_email: String,
    password: String,
    gender: String,
    about: String,
    user_profile: String,
    create_at: String,
    update_at: String,
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', userSchema, 'Users');