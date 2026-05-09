import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/jwt.js";
import { recruiterOnly } from "../middleware/recruiter.js";
import { validate } from "../middleware/validate.js";
import { updateApplicationStatusSchema } from "../validation/applications.js";
import { updateStatus } from "../controller/application.js";

router.patch("/:id/status", authenticateToken, recruiterOnly, validate(updateApplicationStatusSchema), updateStatus);

export default router;