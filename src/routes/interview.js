import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/jwt.js";
import { recruiterOnly } from "../middleware/recruiter.js";
import { validate } from "../middleware/validate.js";
import { startInterviewSchema, sendMessageSchema } from "../validation/interview.js";
import { startInterview, getRecruiterInterviews, getCandidateInterviews, sendMessage, getInterviewMessage, updateStatus, getInterview } from "../controller/interview.js";

router.post("/start", authenticateToken, recruiterOnly, validate(startInterviewSchema), startInterview);
router.post("/:id/message", authenticateToken, validate(sendMessageSchema), sendMessage);
router.get("/:id/messages", authenticateToken, getInterviewMessage);
router.patch("/:id/status", authenticateToken, updateStatus);
router.get("/recruiter", authenticateToken, recruiterOnly, getRecruiterInterviews);
router.get("/candidate", authenticateToken, getCandidateInterviews);
router.get("/:id", authenticateToken, getInterview);

export default router;