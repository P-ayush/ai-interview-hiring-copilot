export const recruiterOnly = (
    req,
    res,
    next
) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                success: false,
                message:
                    "Only recruiters can access this resource",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};