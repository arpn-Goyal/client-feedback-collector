// models/Feedback.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectVersion: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    files: [{ type: String }], // Will store file URLs or filenames
    reaction: {
      type: String,
      enum: ['happy', 'meh', 'sad'],
      default: 'meh',
    },
    feedback: {
      featureRequests: { type: String, default: '' },
      bugsIssues: { type: String, default: '' },
      positiveFeedback: { type: String, default: '' },
      complaints: { type: String, default: '' },
      versionFeedback: { type: String, default: '' },
    },
    token: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
