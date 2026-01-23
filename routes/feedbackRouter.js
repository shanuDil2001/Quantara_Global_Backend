import express from "express";
import {
  createFeedback,
  deleteFeedback,
  getFeedbacks,
  updateFeedbackStatus,
} from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedbacks);
feedbackRouter.put("/:id", updateFeedbackStatus);
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;
