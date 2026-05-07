import { Sequelize } from "sequelize";

 const InterviewMessages = (sequelize) => {
    return sequelize.define("interview_messages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        interviewId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        sender: {
            type: Sequelize.ENUM("ai", "candidate"),
            allowNull: false,
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
};

export default InterviewMessages