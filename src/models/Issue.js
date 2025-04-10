import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  student: {
    type: String,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    enum: ['electrical', 'plumbing', 'furniture', 'cleaning', 'other'],
    required: [true, 'Please select a category'],
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending',
  },
  adminRemarks: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
