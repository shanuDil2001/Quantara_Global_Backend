// Section 01: Import dependencies
import express from "express";
import cors from "cors";
import { env } from "./config/envValidator.js";
import userRouter from "./routes/userRouter.js";
import connectToMongoDB from "./config/connectToMongoDB.js";
import QsJobRouter from "./routes/qsJobRouter.js";
import ItJobRouter from "./routes/itJobRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";

// Section 02: Create the express app
const app = express();


// Section 04: Configure middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:3000",
      "https://www.domain_name",
      "https://project_name-nu.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Section 05: Connect backend to mongoDB
connectToMongoDB();

// Section 06: Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the Quantara Global Backend! testing");
});
app.use("/api/users/", userRouter);
app.use("/api/qs-jobs/", QsJobRouter);
app.use("/api/it-jobs/", ItJobRouter);
app.use("/api/feedbacks", feedbackRouter);

// Section 07: Start the server
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${env.PORT}`);
});
