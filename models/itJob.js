import mongoose from "mongoose";

const ItJobSchema = new mongoose.Schema({
  itJobId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  itSolutionType: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "done", "rejected"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ItJob = mongoose.model("itJobs", ItJobSchema);

export default ItJob;
