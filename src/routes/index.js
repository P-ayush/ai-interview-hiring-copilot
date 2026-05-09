import authRoutes from "./auth.js";
import jobRoutes from "./job.js";
import candidateRoutes from "./candidate.js";
import applicationRoutes from "./application.js"

const routes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/job", jobRoutes);
    app.use("/api/candidate", candidateRoutes);
    app.use("/api/application", applicationRoutes);
};

export default routes;