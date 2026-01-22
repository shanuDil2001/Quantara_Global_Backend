import ItJob from "../models/itJob.js";
import {
  sendEmailJobApprovedIT,
  sendEmailWorkDoneIT,
} from "./userController.js";

export async function createItJob(req, res) {
  try {
    const lastJob = await ItJob.findOne().sort({ date: -1 });

    let itJobId = "IT00001";
    if (lastJob?.itJobId) {
      const lastNum = parseInt(lastJob.itJobId.replace("IT", ""), 10);
      const nextNum = lastNum + 1;
      itJobId = "IT" + String(nextNum).padStart(5, "0");
    }
    const { name, email, whatsappNumber, itSolutionType, jobDescription } =
      req.body;

    const newItJob = new ItJob({
      itJobId,
      name,
      email,
      whatsappNumber,
      itSolutionType,
      jobDescription,
    });

    const savedJob = await newItJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllItJobs(req, res) {
  try {
    const itJobs = await ItJob.find();
    res.status(200).json(itJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getItJobById(req, res) {
  try {
    const { id } = req.params;
    const itJob = await ItJob.findById(id);
    if (!itJob) {
      return res.status(404).json({ message: "IT job not found." });
    }
    res.status(200).json(itJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateItJobStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedItJob = await ItJob.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedItJob) {
      return res.status(404).json({ message: "IT job not found." });
    }

    if (status === "approved") {
      await sendEmailJobApprovedIT(updatedItJob);
    }

    if (status === "done") {
      await sendEmailWorkDoneIT(updatedItJob);
    }

    res.status(200).json(updatedItJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteItJob(req, res) {
  try {
    const { id } = req.params;

    const deletedItJob = await ItJob.findByIdAndDelete(id);

    if (!deletedItJob) {
      return res.status(404).json({ message: "IT job not found." });
    }

    res.status(200).json({ message: "IT job deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
