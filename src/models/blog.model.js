const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail:
    {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'General'
    },
    tags: {
        type: [String],
        default: [],
    },
    likes: {
        type: Number,
        default: 0
    },
    comment: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
            msg: {
                type: String,
                required: true
            },
            create_at: String
        }
    ],
    create_at: String,
    update_at: String
});

module.exports = mongoose.model('Blogs', blogSchema, 'Blogs'); 