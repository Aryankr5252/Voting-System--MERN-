// models/Election.js
import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  endDate: {
    type: Date,
    required: true,
  },
  isEnded: {
    type: Boolean,
    default: false,
  },
});

const Election = mongoose.model('Election', electionSchema);
export default Election;
