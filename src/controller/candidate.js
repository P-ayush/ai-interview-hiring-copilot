import { PDFParse } from "pdf-parse";
import db from "../models/index.js";
import fs from "fs";
import path from "path";
import { analyzeResumeAI } from "../service/ai.js";

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required",
            });
        }
        const dataBuffer = await fs.promises.readFile(req.file.path);
        const parser = new PDFParse({
            data: dataBuffer,
        });
        const pdfData = await parser.getText();
        await parser.destroy();
        const extractedText = pdfData.text;
        const aiData = await analyzeResumeAI(extractedText);
        console.log(aiData);
        let candidate = await db.Candidates.findOne({
            where: {
                userId: req.user.id,
            },
        })
        if (candidate) {
            if (candidate.resumeUrl) {
                const oldFilePath = path.resolve(candidate.resumeUrl);
                if (fs.existsSync(oldFilePath)) {
                    await fs.promises.unlink(oldFilePath);
                }
            }
            await candidate.update({
                fileName: req.file.filename,
                resumeUrl: req.file.path,
                aiSummary: aiData.summary,
                aiScore: aiData.score,
                extractedText,
            });
            return res.status(200).json({
                success: true,
                message: "Resume updated successfully",
                data: candidate,
            });
        }
        candidate = await db.Candidates.create({
            userId: req.user.id,
            fileName: req.file.filename,
            resumeUrl: req.file.path,
            aiSummary: aiData.summary,
            aiScore: aiData.score,
            extractedText,
        });

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            data: candidate,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const candidate = await db.Candidates.findOne({
            where: { userId },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate profile not found" });
        }
        return res.status(200).json({ success: true, message: "Profile fetched successfully", data: candidate });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const candidate = await db.Candidates.findOne({
            where: { userId },
        });

        if (!candidate) {

            return res.status(404).json({
                success: false,
                message: "Candidate profile not found",
            });

        }

        const {
            bio,
            experience,
            linkedinUrl,
            githubUrl,
            skills,
        } = req.body;

        await candidate.update({

            bio,
            experience,
            linkedinUrl,
            githubUrl,
            skills,

        });

        return res.status(200).json({

            success: true,
            message: "Profile updated successfully",
            data: candidate,

        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};