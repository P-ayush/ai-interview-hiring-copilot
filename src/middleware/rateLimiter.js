import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests, please try again after 1 minute",
    },
});

export { loginLimiter };