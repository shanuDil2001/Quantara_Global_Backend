import mongoose from "mongoose";

const QsJobSchema = new mongoose.Schema({
  qsJobId: {
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
  jobCategory: {
    type: String,
    required: true,
  },
  message: {
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

const QsJob = mongoose.model("qsJobs", QsJobSchema);

export default QsJob;
