import mongoose from 'mongoose';

const OutpassSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason'],
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination'],
  },
  departureDate: {
    type: Date,
    required: [true, 'Please provide a departure date'],
  },
  returnDate: {
    type: Date,
    required: [true, 'Please provide a return date'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
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

export default mongoose.models.Outpass || mongoose.model('Outpass', OutpassSchema);
