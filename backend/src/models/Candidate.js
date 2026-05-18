import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  skills: { type: [String], default: [] },
  experience: { type: Number, default: 0, min: 0 },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

CandidateSchema.index({ owner: 1, email: 1 }, { unique: true });

export default mongoose.model('Candidate', CandidateSchema);
