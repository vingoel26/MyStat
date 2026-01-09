/**
 * Submission Model
 */

import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
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
    problem_id: {
        type: String,
        maxlength: 100
    },
    problem_name: {
        type: String,
        required: true,
        maxlength: 255
    },
    problem_url: {
        type: String,
        maxlength: 500
    },
    difficulty: {
        type: String,
        maxlength: 20
    },
    status: {
        type: String,
        required: true,
        maxlength: 20
    },
    language: {
        type: String,
        maxlength: 50
    },
    submitted_at: {
        type: Date
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false
    }
});

// Indexes
submissionSchema.index({ user: 1 });
submissionSchema.index({ platform: 1 });
submissionSchema.index({ difficulty: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submitted_at: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
