import db from "../models/index.js";
import { generateInterviewQuestion, generateInterviewFeedback } from "../service/ai.js";

export const startInterview = async (req, res) => {
    try {
        const application = await db.Applications.findOne({ where: { id: req.body.applicationId } })
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }
        const existingInterview = await db.Interviews.findOne({ where: { applicationId: application.id } })
        if (existingInterview) {
            return res.status(400).json({ success: false, message: "Interview already started" });
        }
        const interview = await db.Interviews.create({
            applicationId: application.id,
            status: "started"
        })
        const job = await db.Jobs.findOne({ where: { id: application.jobId } })
        const candidate = await db.Candidates.findOne({ where: { id: application.candidateId } })
        const question = await generateInterviewQuestion(candidate.extractedText, job.description)
        if (!question) {
            return res.status(500).json({ success: false, message: "Failed to generate interview question" });
        }
        const interviewMessage = await db.InterviewMessages.create({
            interviewId: interview.id,
            sender: "ai",
            message: question.question
        })
        return res.status(201).json({
            success: true, message: "Interview started successfully", interview, firstQuestion:
                question.question,
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getRecruiterInterviews = async (req, res) => {
    try {
        const interviews =
            await db.Interviews.findAll({
                include: [
                    {
                        model: db.Applications,
                        required: true,
                        include: [
                            {
                                model: db.Jobs,
                                required: true,
                                where: {
                                    recruiterId:
                                        req.user.id,
                                },
                            },
                            {
                                model: db.Candidates,
                                include: [
                                    {
                                        model: db.Users,
                                        attributes: {
                                            exclude: ["password"],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
                order: [
                    ["createdAt", "DESC"]
                ],
            });
        return res.status(200).json({
            success: true,
            message:
                "Recruiter interviews fetched successfully",
            interviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const sendMessage = async (
    req,
    res
) => {

    try {

        const interview =
            await db.Interviews.findOne({
                where: {
                    id: req.params.id
                },
            });
        if (!interview) {
            return res.status(404).json({
                success: false,
                message:
                    "Interview not found",
            });
        }
        await db.InterviewMessages.create({
            interviewId:
                interview.id,
            sender: "candidate",
            message:
                req.body.message,
        });
        const previousMessages =
            await db.InterviewMessages.findAll({
                where: {
                    interviewId:
                        interview.id
                },

                order: [
                    ["createdAt", "ASC"]
                ],
            });
        const application =
            await db.Applications.findOne({

                where: {
                    id:
                        interview.applicationId
                },

            });
        const job = await db.Jobs.findOne({
            where: {
                id: application.jobId
            },
        });
        const candidate =
            await db.Candidates.findOne({
                where: {
                    id:
                        application.candidateId
                },
            });
        const aiResponse =
            await generateInterviewQuestion(
                candidate.extractedText,
                job.description,
                previousMessages
            );
        const aiMessage =
            await db.InterviewMessages.create({
                interviewId:
                    interview.id,
                sender: "ai",
                message:
                    aiResponse.question,
            });
        return res.status(201).json({
            success: true,
            message:
                "Message sent successfully",
            aiMessage,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getInterviewMessage = async (req, res) => {
    try {
        const interview = await db.Interviews.findOne({ where: { id: req.params.id } })
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        const messages = await db.InterviewMessages.findAll({ where: { interviewId: interview.id }, order: [["createdAt", "ASC"]] })
        return res.status(200).json({ success: true, message: "Interview messages fetched successfully", messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const interview = await db.Interviews.findOne({
            where: { id: req.params.id }, include: [
                {
                    model: db.Applications,
                    include: [
                        {
                            model: db.Jobs,
                        },
                        {
                            model: db.Candidates,
                        },
                    ],
                },
            ],
        })
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        if (interview.status === "completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Interview already completed",
            });
        }
        const interviewMessage = await db.InterviewMessages.findAll({ where: { interviewId: interview.id }, order: [["createdAt", "ASC"]] })
        const aiFeedback = await generateInterviewFeedback(interview.application.candidate.extractedText, interview.application.job.description, interviewMessage)
        interview.feedback = aiFeedback.feedback
        interview.finalScore = aiFeedback.score
        interview.status = "completed"
        await interview.save()
        return res.status(200).json({ success: true, message: "Interview status updated successfully", interview });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const getCandidateInterviews = async (req, res) => {
    try {
        const interviews =
            await db.Interviews.findAll({
                include: [
                    {
                        model: db.Applications,
                        required: true,
                        include: [
                            {
                                model: db.Jobs,
                            },
                            {
                                model: db.Candidates,
                                required: true,
                                where: {
                                    userId:
                                        req.user.id,
                                },
                            },
                        ],
                    },
                ],
                order: [
                    ["createdAt", "DESC"]
                ],
            });
        return res.status(200).json({
            success: true,
            message:
                "Candidate interviews fetched successfully",
            interviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getInterview = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)
        let offset = (page - 1) * limit
        const interview =
            await db.Interviews.findOne({
                where: { id: req.params.id },
                limit,
                offset,
                include: [
                    {
                        model: db.Applications,
                        include: [
                            {
                                model: db.Jobs,

                            },
                            {
                                model: db.Candidates,
                                include: [
                                    {
                                        model: db.Users,
                                        attributes: {
                                            exclude: ["password"],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
                order: [
                    ["createdAt", "DESC"]
                ],
            });
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }
        return res.status(200).json({ success: true, message: "Interview fetched successfully", interview });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}