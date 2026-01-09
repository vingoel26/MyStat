/**
 * User Model
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        maxlength: 255
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        maxlength: 50
    },
    password_hash: {
        type: String,
        required: [true, 'Password is required']
    },
    bio: {
        type: String,
        default: null
    },
    avatar_url: {
        type: String,
        maxlength: 500,
        default: null
    },
    is_public: {
        type: Boolean,
        default: true
    },
    skills: {
        type: [String],
        default: []
    },
    social_links: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Note: email and username indexes are automatically created by unique: true

const User = mongoose.model('User', userSchema);

export default User;
