/**
 * Daily Stats Model (for heatmap)
 */

import mongoose from 'mongoose';

const dailyStatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    problems_solved: {
        type: Number,
        default: 0
    },
    submissions_made: {
        type: Number,
        default: 0
    },
    platforms_active: {
        type: [String],
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Compound unique index (user + date)
dailyStatSchema.index({ user: 1, date: 1 }, { unique: true });
dailyStatSchema.index({ user: 1 });
dailyStatSchema.index({ date: -1 });

const DailyStat = mongoose.model('DailyStat', dailyStatSchema);

export default DailyStat;
