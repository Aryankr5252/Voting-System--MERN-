import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  endDate: {
    type: Date,
    required: false, // only required when admin sets it
  },
  hasEnded: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

const electionModel = mongoose.model("Election", electionSchema);

export default electionModel;
