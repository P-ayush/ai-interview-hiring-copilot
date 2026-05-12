import db from "../models/index.js";

export const updateStatus = async (req, res) => {
    try {
        const application = await db.Applications.findOne({ where: { id: req.params.id } })
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }
        application.status = req.body.status;
        await application.save();
        return res.status(200).json({ success: true, message: "Application status updated successfully", application });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const listApplications = async (req, res) => {

    try {
        const page =
            parseInt(req.query.page)
            || 1;
        const limit =
            parseInt(req.query.limit)
            || 10;

        let whereCondition =
            {};
        let jobInclude = {
            model: db.Jobs,
        };
        if (
            req.user.role
            === "recruiter"
        ) {
            jobInclude.where = {
                recruiterId:
                    req.user.id,
            };
        }
        let candidate =
            null;
        if (
            req.user.role
            === "candidate"
        ) {
            candidate =
                await db.Candidates.findOne({
                    where: {
                        userId:
                            req.user.id,
                    },
                });
            whereCondition = {
                candidateId:
                    candidate.id,
            };
        }
        const applications =
            await db.Applications.findAndCountAll({

                where:
                    whereCondition,
                include: [
                    jobInclude,
                    {
                        model:
                            db.Candidates,
                    },
                    {
                        model:
                            db.Interviews,

                        required:
                            false,
                    },
                ],
                limit,
                offset:
                    (page - 1)
                    * limit,
                order: [
                    ["createdAt", "DESC"]
                ],
            });
        return res.status(200).json({
            success: true,
            message:
                "Applications fetched successfully",
            applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};