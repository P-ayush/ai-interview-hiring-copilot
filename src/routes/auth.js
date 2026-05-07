import express from "express";
const router = express.Router();

import { signUp, login } from "../controller/auth.js";

router.post("/signup", signUp);
router.post("/login", login);

export default router;
