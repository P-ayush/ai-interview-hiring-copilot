import db from '../models/index.js'
import { matchResumeToJob } from '../service/ai.js'
export const createJob = async (req, res) => {
    try {
        const { title, description, experienceLevel, skills } = req.body

        const job = await db.Jobs.create({
            title,
            description,
            experienceLevel,
            skills,
            recruiterId: req.user.id
        });
        return res.status(201).json({ success: true, message: "Job created successfully", job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const jobs = await db.Jobs.findAndCountAll({
            limit,
            offset: (page - 1) * limit
        })
        return res.status(200).json({ success: true, message: "Jobs fetched successfully", jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getJobById = async (req, res) => {
    try {
        const job = await db.Jobs.findOne({ where: { id: req.params.id } })
        return res.status(200).json({ success: true, message: "Job fetched successfully", job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateJob = async (req, res) => {
    try {
        const { title, description, experienceLevel, skills } = req.body
        const job = await db.Jobs.findOne({ where: { id: req.params.id } })

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        if (job.recruiterId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        job.title = title;
        job.description = description;
        job.experienceLevel = experienceLevel;
        job.skills = skills;
        await job.save();
        return res.status(200).json({ success: true, message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteJob = async (req, res) => {
    try {
        const job = await db.Jobs.findOne({ where: { id: req.params.id } })

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        if (job.recruiterId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        await job.destroy();
        return res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const applyForJob = async (req, res) => {
    try {
        const job = await db.Jobs.findOne({ where: { id: req.params.id } })
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        const candidate = await db.Candidates.findOne({ where: { userId: req.user.id } })
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        if (!candidate.resumeUrl) {
            return res.status(400).json({
                success: false,
                message: "Resume is required to apply",
            });
        }
        const existingApplication =
            await db.Applications.findOne({

                where: {
                    jobId: job.id,
                    candidateId: candidate.id,
                },

            });

        if (existingApplication) {

            return res.status(400).json({
                success: false,
                message: "Already applied to this job",
            });

        }
        const aiData = await matchResumeToJob(
            candidate.extractedText,
            job.description
        );
        const application = await db.Applications.create({
            jobId: job.id,
            candidateId: candidate.id,
            aiMatchScore: aiData.matchScore,
            aiFeedback: aiData.feedback
        })
        return res.status(200).json({ success: true, message: "Job applied successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getApplicants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const job = await db.Jobs.findOne({ where: { id: req.params.jobId } })
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        const { count, rows } = await db.Applications.findAndCountAll({
            where: { jobId: job.id },
            limit,
            offset: (page - 1) * limit,
            order: [["createdAt", "DESC"]],
        })
        return res.status(200).json({
            success: true,
            message: "Applicants fetched successfully",
            totalApplicants: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            applications: rows,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}