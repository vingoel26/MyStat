/**
 * Contest Model
 */

import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlatformAccount',
        default: null
    },
    platform: {
        type: String,
        required: true,
        maxlength: 50
    },
    contest_id: {
        type: String,
        maxlength: 100
    },
    contest_name: {
        type: String,
        required: true,
        maxlength: 255
    },
    contest_url: {
        type: String,
        maxlength: 500
    },
    rank: {
        type: Number,
        default: null
    },
    rating_change: {
        type: Number,
        default: null
    },
    new_rating: {
        type: Number,
        default: null
    },
    problems_solved: {
        type: Number,
        default: 0
    },
    participated_at: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

// Indexes
contestSchema.index({ user: 1 });
contestSchema.index({ platform: 1 });
contestSchema.index({ participated_at: -1 });

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
