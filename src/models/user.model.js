const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: String,
    user_email: String,
    password: String,
    gender: String,
    about: String,
    profile_image: String,
    reset_otp: String,
    reset_otp_expire: {
        type: Date,
        default: null
    },
    attempt: {
        type: Number,
        default: 0,
    },
    attempt_expire: {
        type: Date,
        default: null
    },
    verify_attempt: {
        type: Number,
        default: 0,
    },
    verify_attempt_expire: {
        type: Date,
        default: null
    },
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
})

module.exports = mongoose.model('Users', userSchema, 'Users');