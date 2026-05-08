import { Sequelize } from "sequelize";

const Applications = (sequelize) => {

    return sequelize.define("applications", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        candidateId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        jobId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM(
                "applied",
                "shortlisted",
                "rejected",
                "interview",
                "selected"
            ),
            defaultValue: "applied",
        },
        aiMatchScore: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        aiFeedback: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });

};

export default Applications;