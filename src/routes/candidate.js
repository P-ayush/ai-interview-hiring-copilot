import express from "express";
import upload from "../middleware/upload.js";
const router = express.Router();

import { uploadResume } from "../controller/candidate.js";

router.post("/upload-resume", upload.single("resume"), uploadResume);

export default router;