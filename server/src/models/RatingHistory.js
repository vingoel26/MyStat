/**
 * Rating History Model
 */

import mongoose from 'mongoose';

const ratingHistorySchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: true
    },
    contest_id: {
        type: String,
        maxlength: 100
    },
    recorded_at: {
        type: Date,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

// Indexes
ratingHistorySchema.index({ user: 1 });
ratingHistorySchema.index({ platform: 1 });
ratingHistorySchema.index({ recorded_at: -1 });

const RatingHistory = mongoose.model('RatingHistory', ratingHistorySchema);

export default RatingHistory;
