/**
 * Platform Account Model
 */

import mongoose from 'mongoose';

const platformAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        required: true,
        maxlength: 50
    },
    platform_username: {
        type: String,
        required: true,
        maxlength: 100
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_token: {
        type: String,
        maxlength: 255,
        default: null
    },
    last_synced_at: {
        type: Date,
        default: null
    },
    profile_data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Compound unique index (user + platform + username) - allows multiple accounts per platform
platformAccountSchema.index({ user: 1, platform: 1, platform_username: 1 }, { unique: true });
platformAccountSchema.index({ user: 1 });
platformAccountSchema.index({ platform: 1 });

const PlatformAccount = mongoose.model('PlatformAccount', platformAccountSchema);

export default PlatformAccount;
