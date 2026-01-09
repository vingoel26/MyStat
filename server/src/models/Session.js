/**
 * Session Model (for JWT refresh tokens)
 */

import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refresh_token: {
        type: String,
        required: true,
        maxlength: 500
    },
    user_agent: {
        type: String
    },
    ip_address: {
        type: String,
        maxlength: 45
    },
    expires_at: {
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
sessionSchema.index({ user: 1 });
sessionSchema.index({ refresh_token: 1 });
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Session = mongoose.model('Session', sessionSchema);

export default Session;
