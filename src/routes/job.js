import express from "express";
const router = express.Router();

import { createJob, getAllJobs, getJobById, updateJob, deleteJob, applyForJob } from "../controller/job.js";

router.post("/", createJob);
router.post("/:id/apply", applyForJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;