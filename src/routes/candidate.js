import express from "express";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/jwt.js";

const router = express.Router();

import { uploadResume } from "../controller/candidate.js";

router.post("/upload-resume", authenticateToken, upload.single("resume"), uploadResume);

export default router;