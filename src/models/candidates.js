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

        bio: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        experience: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        linkedinUrl: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        githubUrl: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        skills: {
            type: Sequelize.JSON,
            allowNull: true,
        },

        resumeUrl: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        extractedText: {
            type: Sequelize.TEXT("long"),
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

export default Candidates;