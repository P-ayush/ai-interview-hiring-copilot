import { Sequelize } from "sequelize";
const Candidates = (sequelize) => {
    return sequelize.define("candidates", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        resumeUrl: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        extractedText: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        aiSummary: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        aiScore: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });
};

export default Candidates