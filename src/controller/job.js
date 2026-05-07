import db from '../models/index.js'
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