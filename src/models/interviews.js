import { Sequelize } from "sequelize";

 const Interviews = (sequelize) => {
    return sequelize.define("interviews", {
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
            type: Sequelize.ENUM("started", "completed"),
            defaultValue: "started",
        },
        finalScore: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        feedback: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    }, {
        timestamps: true,
    });
};
export default Interviews