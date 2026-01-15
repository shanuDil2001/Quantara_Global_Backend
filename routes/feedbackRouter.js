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
feedbackRouter.put("/", updateFeedbackStatus);
feedbackRouter.delete("/", deleteFeedback);

export default feedbackRouter;
