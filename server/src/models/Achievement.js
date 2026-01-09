/**
 * Achievement Model
 */

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievement_key: {
        type: String,
        required: true,
        maxlength: 100
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String
    },
    icon: {
        type: String,
        maxlength: 50
    },
    unlocked_at: {
        type: Date,
        default: Date.now
    }
});

// Compound unique index (user + achievement_key)
achievementSchema.index({ user: 1, achievement_key: 1 }, { unique: true });
achievementSchema.index({ user: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
