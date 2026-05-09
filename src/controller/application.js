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