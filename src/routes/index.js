import authRoutes from "./auth.js";
import jobRoutes from "./job.js";
import candidateRoutes from "./candidate.js";
import applicationRoutes from "./application.js"
import interviewRoutes from "./interview.js"

const routes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/job", jobRoutes);
    app.use("/api/candidate", candidateRoutes);
    app.use("/api/application", applicationRoutes);
    app.use("/api/interview", interviewRoutes);
};

export default routes;