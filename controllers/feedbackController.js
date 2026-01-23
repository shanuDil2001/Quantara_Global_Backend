import Feedback from "../models/feedback.js";

export async function createFeedback(req, res) {
  try {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({
        message: "All fields (name, rating, message) are required",
      });
    }


    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        message: "Message must not exceed 500 characters",
      });
    }

    const feedback = await Feedback.create({
      name,
      rating,
      message,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Get all feedbacks for admin and get approved feedbacks for public
export async function getFeedbacks(req, res) {
  try {
    const isAdmin = req.user && req.user.role === "admin";

    const filter = isAdmin ? {} : { status: "approved" };

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Feedbacks retrieved successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get Feedbacks Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Update feedback status (admin only)
export async function updateFeedbackStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      message: "Feedback status updated successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Update Feedback Status Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Delete feedback (admin only)
export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
