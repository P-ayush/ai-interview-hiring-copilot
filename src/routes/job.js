import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/jwt.js";
import { recruiterOnly } from "../middleware/recruiter.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, applyForJob, getApplicants,getRecruiterJobs } from "../controller/job.js";

router.post("/", authenticateToken, recruiterOnly, createJob);
router.post("/:id/apply", authenticateToken, applyForJob);
router.get("/recruiter", authenticateToken, recruiterOnly, getRecruiterJobs);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.get("/:jobId/applicants", authenticateToken, getApplicants);
router.put("/:id", authenticateToken, recruiterOnly, updateJob);
router.delete("/:id", authenticateToken, recruiterOnly, deleteJob);

export default router;