import express from "express";
const router = express.Router();
import { validate } from "../middleware/validate.js";
import { loginSchema, signUpSchema } from "../validation/auth.js";
import { signUp, login } from "../controller/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

router.post("/signup", validate(signUpSchema), signUp);
router.post("/login", loginLimiter, validate(loginSchema), login);

export default router;
