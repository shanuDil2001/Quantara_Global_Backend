import QsJob from "../models/qsJob.js";
import {
  sendEmailJobApprovedQS,
  sendEmailWorkDoneQS,
} from "./userController.js";

export async function createQsJob(req, res) {
  try {
    const lastJob = await QsJob.findOne().sort({ date: -1 });

    let qsJobId = "QS00001";
    if (lastJob?.qsJobId) {
      const lastNum = parseInt(lastJob.qsJobId.replace("QS", ""), 10);
      const nextNum = lastNum + 1;
      qsJobId = "QS" + String(nextNum).padStart(5, "0");
    }
    const { name, email, whatsappNumber, jobCategory, message } = req.body;

    const newQsJob = new QsJob({
      qsJobId,
      name,
      email,
      whatsappNumber,
      jobCategory,
      message,
    });

    const savedJob = await newQsJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: "Failed to create QS job." });
  }
}

export async function getAllQsJobs(req, res) {
  try {
    const qsJobs = await QsJob.find();
    res.status(200).json(qsJobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve QS jobs." });
  }
}

export async function getQsJobById(req, res) {
  try {
    const { id } = req.params;
    const qsJob = await QsJob.findById(id);
    if (!qsJob) {
      return res.status(404).json({ error: "QS job not found." });
    }
    res.status(200).json(qsJob);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve QS job." });
  }
}

export async function updateQsJobStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedQsJob = await QsJob.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedQsJob) {
      return res.status(404).json({ error: "QS job not found." });
    }

    if (status === "approved") {
      await sendEmailJobApprovedQS(updatedQsJob);
    }

    if (status === "done") {
      await sendEmailWorkDoneQS(updatedQsJob);
    }

    res.status(200).json(updatedQsJob);
  } catch (error) {
    res.status(500).json({ error: "Failed to update QS job status." });
  }
}

export async function deleteQsJob(req, res) {
  try {
    const { id } = req.params;

    const deletedQsJob = await QsJob.findByIdAndDelete(id);

    if (!deletedQsJob) {
      return res.status(404).json({ error: "QS job not found." });
    }

    res.status(200).json({ message: "QS job deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete QS job." });
  }
}
