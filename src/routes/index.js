import authRoutes from "./auth.js";
import jobRoutes from "./job.js";
import candidateRoutes from "./candidate.js";
import {authenticateToken} from "../middleware/jwt.js";

const routes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/job", authenticateToken, jobRoutes);
    app.use("/api/candidate", authenticateToken, candidateRoutes);
};

export default routes;