// models/Election.js
import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  endDate: Date,
  isEnded: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Election', electionSchema);
